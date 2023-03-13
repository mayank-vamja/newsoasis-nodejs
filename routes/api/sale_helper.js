var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Sale = require("../../models/sales");
var cors = require("cors");

router.get("/", cors(), (req, res) => {
  Sale.find({}, "-_id", (err, sales) =>
    err ? res.json({ success: false, error: err })
      : res.json({ success: true, sales }));
});

module.exports = router;