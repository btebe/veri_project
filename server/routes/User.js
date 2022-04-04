const express = require("express");
const router = express.Router();
const { Users, Tokens } = require("../models");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/SendEmail");
const crypto = require("crypto");

//REGISTRATION

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await Users.findOne({
      where: { email: email },
    });
    if (user)
      return res.status(409).send({ message: "Username already taken!" });

    //create user
    const hashPassword = await bcrypt.hash(password, 10);
    const user2 = await Users.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
    });

    //create token
    const token = await Tokens.create({
      userID: user2.id,
      token: crypto.randomBytes(32).toString("hex"),
    });
   
    const url = `${process.env.PRODUCTION_URL}users/${user2.id}/verify/${token.token}`;
    //send verification email to user and url will be the body
    await sendEmail(user2.email, "verify account", url);
    res
      .status(201)
      .send({ message: "An Email has been sent to you, please verify" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

//the router to verify account
router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.params.id } });
    if (!user) return res.status(400).send({ message: "Invalid Link" });

    const token = await Tokens.findOne({
      where: {
        userID: user.id,
        token: req.params.token,
      },
    });
    if (!token) return res.status(400).send({ message: "Invalid Link" });
    //if user and token exist update verify to true
    await Users.update({ verify: true }, { where: { id: user.id } });
    //remove token of row for that user cuz already verified
    await token.destroy();
    res.status(200).send({ message: "Email verified successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
