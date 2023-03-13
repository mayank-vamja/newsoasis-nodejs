const express = require("express");
const app = express();
const { mongoDbUrl } = require("../../.env");

const mongoose = require("mongoose");
mongoose.connect(
  mongoDbUri,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const openWeatherMapApi = require("./routes/api/openweathermap");
const saleHelper = require("./routes/api/sale_helper");
const contactApi = require("./routes/api/portfolio");
const googleApi = require("./routes/api/google/index");
const newsoasis = require("./routes/newsoasis");

app.get("/favicon.ico", (_, res) => res.status(204));

// APP Configuration
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(newsoasis);

// MARK: openWeatherMapApi get cities and countries list
app.use("/api/openweathermap/locations", openWeatherMapApi);

const appIdMiddleWare = require("./routes/middleware/app-id");
// Note: Empty
app.use("/api/sale-helper/sales", appIdMiddleWare, saleHelper);

// MARK: ContactApi for mailing incoming message to my mail
// TODO: Not Secured, make secure by adding some authenticity
app.use("/api/portfolio", contactApi);

// Google Trends Api exposed
app.use("/api/news", appIdMiddleWare, googleApi);

// Listen To Port
app.listen(process.env.PORT || 4000);
