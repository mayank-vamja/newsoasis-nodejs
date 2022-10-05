var express = require("express")
var router = express.Router()
var Location = require("../../models/location")
var Country = require("../../models/country")
var mongoose = require("mongoose")
var cors = require("cors")

router.get("/countries", cors(), (req, res) => {
  if (req.query.q) {
    var regexp = new RegExp(req.query.q, "i")
    Country.find({ name: regexp }, "-_id", (err, countries) =>
      err
        ? res.json({ success: false, message: `${err?.message ?? err}` })
        : res.json(countries)
    )
  } else {
    Country.find({}, "-_id", (err, countries) =>
      err
        ? res.json({ success: false, message: `${err?.message ?? err}` })
        : res.json(countries)
    )
  }
})

router.get("/cities", cors(), (req, res) => {
  let limit = +req.query.size || 50
  let q = req.query.q || ""
  Location.find({ name: new RegExp(q, "i") }, "-_id", (err, locations) => {
    err
      ? res.json({ success: false, message: `${err?.message ?? err}` })
      : res.json(locations)
  }).limit(limit)
})

router.get("/:code", cors(), (req, res) => {
  let limit = +req.query.size || 50
  let code = req.params.code
  let q = req.query.q || ""
  Location.find(
    { country: new RegExp(code, "i"), name: new RegExp(q, "i") },
    "-_id",
    (err, locations) => {
      err
        ? res.json({ success: false, message: `${err?.message ?? err}` })
        : res.json(locations)
    }
  ).limit(limit)
})

module.exports = router
