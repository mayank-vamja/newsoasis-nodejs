const nodemailer = require("nodemailer");
const { fromMailID, mailIdPassword } = require("../../../.env");

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: fromMailID, pass: mailIdPassword },
});

const sendEmail = (mailOptions) => transpoter.sendMail(mailOptions);

module.exports = sendEmail;
