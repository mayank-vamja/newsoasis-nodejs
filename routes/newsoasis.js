const express = require("express")
const router = express.Router()

const { newsAPIKey } = require("../.env")
const NewsAPI = require("newsapi")
const newsapi = new NewsAPI(newsAPIKey)

const moment = require("moment")
const cheerio = require("cheerio")
const fetch = require("node-fetch")
const googleTrends = require("google-trends-api")

// ROOT-GET route
router.get("/", (req, res) => {
  googleTrends.dailyTrends(
    { geo: "IN", trendDate: new Date() },
    (err, results) => {
      if (err) {
        console.log(err)
        res.redirect("/top-headlines")
      } else {
        results = JSON.parse(results).default.trendingSearchesDays[0]
          .trendingSearches
        googleTrends.realTimeTrends(
          {
            geo: "IN",
            category: "all",
            hl: "en",
          },
          function (err, results2) {
            if (err) {
              console.log(err)
              res.render("home", { data: results, bigStories: [] })
            } else {
              let bigStories = JSON.parse(results2).storySummaries
                .trendingStories
              res.render("home", { data: results, bigStories, moment: moment })
            }
          }
        )
      }
    }
  )
})

router.get("/top-headlines", function (req, res) {
  let page = +req.query.page || 1
  let pagesize = +req.query.pagesize || 20
  let country = req.query.country || "in"
  newsapi.v2
    .topHeadlines({ country: country, page: page, pageSize: pagesize })
    .then((response) => {
      res.render("index", { data: response, query: req.query, moment: moment })
    })
})

router.get("/article", (req, response) => {
  try {
    let data = JSON.parse(req.query.data)
    var options = { headers: { "user-agent": "node.js" } }
    fetch(data.url, options)
      .then((res) => res.text())
      .then((body) => {
        let paragraphs = []
        let $ = cheerio.load(body)
        $("p").each(function (i, e) {
          paragraphs[i] = $(this).text()
        })
        response.render("article", { data: data, p: paragraphs })
      })
      .catch((err) => {
        console.log("ERROR FETCHING URL")
        response.redirect("/")
      })
  } catch (err) {
    console.log("err")
    response.redirect("/")
  }
})

router.get("/stories", function (req, res) {
  let page = +req.query.page || 1
  let pagesize = +req.query.pagesize || 20
  let country = req.query.country || "in"
  newsapi.v2
    .topHeadlines({ country: country, page: page, pageSize: pagesize })
    .then((response) => res.render("stories", { data: response }))
})

router.get("/sources", (req, res) => {
  newsapi.v2
    .sources({ language: "en" })
    .then((response) => res.render("sources", { sources: response }))
})

router.get("/search", (req, res) => {
  let q = req.query.q ? req.query.q : ""
  let page = +req.query.page || 1
  let pagesize = +req.query.pagesize || 20

  newsapi.v2
    .everything({
      q: q,
      sortBy: "relevancy",
      page: page,
      pageSize: pagesize,
    })
    .then((response) =>
      res.render("index", { data: response, query: req.query, moment: moment })
    )
})

router.get("/search-autocomplete", (req, res) => {
  let q = req.query.q ? req.query.q : ""
  googleTrends
    .autoComplete({ keyword: q })
    .then(function (results) {
      res.json(results)
    })
    .catch(function (err) {
      res.json({ error: err })
    })
})

router.get("/get-realtime-trends", (req, res) => {
  var oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 5)
  googleTrends.dailyTrends(
    { geo: "IN", hl: "en", trendDate: oneWeekAgo },
    (err, results) => {
      if (err) {
        res.json({ success: false, data: null })
      } else {
        results = JSON.parse(
          results
        ).default.trendingSearchesDays[0].trendingSearches.map(
          (i) => i.title.query
        )
        res.json({ success: true, data: results })
      }
    }
  )
})

router.get("/:cat", (req, res) => {
  let page = +req.query.page || 1
  let pagesize = +req.query.pagesize || 20
  let country = req.query.country || "in"
  newsapi.v2
    .topHeadlines({
      category: req.params.cat,
      country: country,
      page: page,
      pageSize: pagesize,
    })
    .then((response) => {
      res.render("index", {
        data: response,
        query: req.query,
        cat: req.params.cat,
        moment: moment,
      })
    })
})

module.exports = router
