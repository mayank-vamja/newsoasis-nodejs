var express = require("express");
var router = express.Router();
var Location = require("../../models/location");
var Country = require("../../models/country");
var mongoose = require("mongoose");
var cors = require("cors");
const sendEmail = require("./mailUtils/transporter");
const getHtmlContent = require("./mailUtils/mailTemplate");
const { fromMailID, toMailId } = require("../../.env");

router.post("/contact", cors(), (req, res) => {
  const mailOptions = {
    from: fromMailID,
    to: toMailId,
    subject: "Contact",
    html: getHtmlContent({
      title: "PORTFOLIO - Contact Us",
      data: [
        ["Name", req.body.name],
        ["Email", req.body.email],
        ["Message", req.body.message],
      ],
    }),
  };
  sendEmail(mailOptions)
    .then((err, info) => {
      if (err) res.status(400);
      else res.send({ success: true });
    })
    .catch((e) => {
      res.status(400);
    });
  res.send({ success: true });
});

module.exports = router;
