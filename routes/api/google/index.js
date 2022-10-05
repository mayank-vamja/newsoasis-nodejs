const express = require("express");
const router = express.Router();
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("77012abcd3b047beba19d9cf6a9467b5");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const moment = require("moment");
const googleTrends = require("google-trends-api");

const categories = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

const adFilters = [
  "ad ",
  "ads ",
  "advertisement ",
  "advertisements ",
  "google ad",
  "facebook ad",
];

router.get("/topics-search", (req, res) => {
  let q = req.query.q ? req.query.q : "";
  googleTrends
    .autoComplete({ keyword: q })
    .then((results) => {
      let topics = JSON.parse(results)?.default?.topics ?? [];
      res.json(topics);
    })
    .catch(() => {
      res.status(400).json({ error: "topics-search api missuse" });
    });
});

router.get("/trending-topics", (req, res) => {
  let geo = req.query.geo || "IN";
  let day = req.query.day || "0";

  if (day < 0 || day > 29) day = 0;
  let date = new Date();
  date.setDate(date.getDate() - day);

  googleTrends
    .dailyTrends({
      trendDate: date,
      geo: geo,
    })
    .then((result) => {
      const news = JSON.parse(result).default.trendingSearchesDays[0];
      const trendingSearches = news.trendingSearches.map((obj) => ({
        query: obj?.title?.query,
        formattedTraffic: obj?.formattedTraffic,
        relatedQueries: obj?.relatedQueries.map((e) => e.query),
        imageUrl: obj?.image?.imageUrl,
        articles: obj?.articles.map((a) => ({
          title: a?.title,
          content: a?.snippet,
          timeAgo: a?.timeAgo,
          source: a?.source,
          url: a?.url,
          imageUrl: a?.image?.imageUrl,
        })),
      }));
      res.json({
        trendingSearches,
        date: news?.date,
        formattedDate: news?.formattedDate,
      });
    })
    .catch((error) => res.status(400).json({ error }));
});

router.get("/trending-today", (req, res) => {
  let geo = req.params.geo ?? "IN";
  let cat = req.params.cat ?? "all";
  googleTrends
    .realTimeTrends({ geo: geo, category: cat })
    .then((result) => {
      let data = JSON.parse(result)?.storySummaries?.trendingStories ?? [];
      data = data.map((e) => ({
        imageUrl: e?.image?.imgUrl,
        articles: e?.articles?.map((a) => ({
          title: a?.articleTitle,
          content: a?.snippet,
          source: a?.source,
          timeAgo: a?.time,
          url: a?.url,
          imageUrl: null,
        })),
      }));
      res.json(data);
    })
    .catch((error) => res.status(400).json({ error: error?.toString() }));
});

router.get("/top-headlines", (req, res) => {
  let page = +req.query.page || 1;
  let pagesize = +req.query.pagesize || 20;
  let country = req.query.country || "in";
  newsapi.v2
    .topHeadlines({ country: country, page: page, pageSize: pagesize })
    .then((response) => {
      const articles = response?.articles.map((a) => ({
        title: a?.title,
        content: a?.description,
        source: a?.source?.name,
        timeAgo: moment(a?.publishedAt ?? new Date()).fromNow(),
        url: a?.url,
        imageUrl: a?.urlToImage,
      }));
      res.json({
        totalResults: response?.totalResults ?? 0,
        articles: articles ?? [],
        page,
        pagesize,
      });
    });
});

router.get("/everything", (req, res) => {
  let q = req.query.q || "a";
  let page = +req.query.page || 1;
  let pagesize = +req.query.pagesize || 20;
  let lang = req.params.params || "en";

  newsapi.v2
    .everything({
      q: q,
      page: page,
      pageSize: pagesize,
      language: lang,
    })
    .then((response) => {
      const articles = response?.articles.map((a) => ({
        title: a?.title,
        content: a?.description,
        source: a?.source?.name,
        timeAgo: moment(a?.publishedAt ?? new Date()).fromNow(),
        url: a?.url,
        imageUrl: a?.urlToImage,
      }));
      res.json({
        totalResults: response?.totalResults ?? 0,
        articles: articles ?? [],
        page,
        pagesize,
      });
    })
    .catch((error) => res.status(400).json({ error }));
});

router.get("/sources", (req, res) => {
  newsapi.v2
    .sources()
    .then((response) => res.json(response.sources))
    .catch((error) => res.status(400).json({ error }));
});

// ARTICAL SCRAPPING

router.post("/artical", (req, response) => {
  /**
   * FORMAT:
   * "url": "url",
   */
  try {
    let data = req.body;
    var options = { headers: { "user-agent": "node.js" } };
    fetch(data.url, options)
      .then((res) => res.text())
      .then((body) => {
        let paragraphs = [];
        let $ = cheerio.load(body);
        $("p").each(function (i, e) {
          let text = $(this).text();
          if (text.length > 40 && !adFilters.includes(text.toLowerCase())) {
            paragraphs.push(text);
          }
        });
        response.json(paragraphs);
      })
      .catch((err) => {
        response.status(400).json({ error: "Error fetching from url" });
      });
  } catch (err) {
    response.status(500).json({ error: "Can not scrap artical" });
  }
});

router.get("/:cat", (req, res) => {
  let cat = req.params.cat;
  if (!categories.includes(cat)) {
    res.status(400).json({
      error:
        "Invalid category.Must be on of business, entertainment, general, health, science, sports, technology",
    });
    return;
  }

  let page = +req.query.page || 1;
  let pagesize = +req.query.pagesize || 20;
  let country = req.query.country || "in";
  let lang = req.params.params || "en";

  newsapi.v2
    .topHeadlines({
      category: cat,
      country: country,
      page: page,
      pageSize: pagesize,
      language: lang,
    })
    .then((response) => {
      res.json({ ...response, page, pagesize });
    })
    .catch((error) => res.status(400).json({ error }));
});

module.exports = router;
