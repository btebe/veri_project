const express = require("express");
const router = express.Router();
const { Users, Tokens } = require("../models");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/SendEmail");
const crypto = require("crypto");
const { sign } = require("jsonwebtoken");

//login
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({
      where: { email: email },
    });
    if (!user)
      return res.status(401).send({ message: "invalid email or password" });

    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) {
        return res.status(401).send({ message: "invalid email or password" });
      } else {
        if (!user.verify) {
          let token = await Tokens.findOne({ where: { userID: user.id } });
          if (!token) {
            const token = await Tokens.create({
              userID: user.id,
              token: crypto.randomBytes(32).toString("hex"),
            });
            
            const url = `${process.env.PRODUCTION_URL}users/${user.id}/verify/${token.token}`;
            //send verification email to user and url will be the body
            await sendEmail(user.email, "verify account", url);
            return res.status(400).send({
              message: "An Email has been sent to you, please verify",
            });
          }
        }
        const accessToken = sign(
          { userID: user.id, username: user.firstName },
          process.env.JWTPRIVATEKEY,
          {
            expiresIn: "7d",
          }
        );
        return res.status(200).send({
          token: accessToken,
          username: user.firstName,
          message: "Logged in successfully",
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
