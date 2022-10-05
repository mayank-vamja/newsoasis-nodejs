const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  imgUrl: String,
  saleUrl: String,
  saleProvider: {
    url: String,
    name: String
  },
  saleDate: Date,
});

module.exports = mongoose.model("Sale", saleSchema);