const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    var smtpConfig = {
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    };
    var transporter = nodemailer.createTransport(smtpConfig);
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully");
  } catch (err) {
    console.log("email not sent!");
    console.log(err);
    return err;
  }
};
