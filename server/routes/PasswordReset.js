const express = require("express");
const router = express.Router();
const { Users, Tokens } = require("../models");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/SendEmail");
const crypto = require("crypto");

//password-reset
//input user email and send email for verification
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({
      where: { email: email },
    });
    if (!user) return res.status(400).send({ message: "User does not exist" });

    //create token
    const token = await Tokens.create({
      userID: user.id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    const url = `${process.env.PRODUCTION_URL}password-reset/${user.id}/${token.token}`;
    //send verification email to user and url will be the body
    await sendEmail(user.email, "reset password", url);
    res
      .status(201)
      .send({ message: "An Email has been sent to you, please verify" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

//will reset user password
router.post("/:id/:token", async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.params.id } });
    if (!user)
      return res.status(400).send({ message: "Invalid Link or Expired" });

    const token = await Tokens.findOne({
      where: {
        userID: user.id,
        token: req.params.token,
      },
    });
    if (!token)
      return res.status(400).send({ message: "Invalid Link or Expired" });
    //update user password
    let pass = req.body.password;
    const hashPassword = await bcrypt.hash(pass, 10);
    await user.update({ password: hashPassword });
    await token.destroy();

    res.status(200).send({ message: "password has been reset successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
