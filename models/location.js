const mongoose = require("mongoose");

const locationsSchema = new mongoose.Schema({
  id: Number,
  name: String,
  state: String,
  country: String,
  coord: {
    lat: Number,
    lon: Number
  },
});

module.exports = mongoose.model("Location", locationsSchema);