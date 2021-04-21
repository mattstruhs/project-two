const express = require("express");
const router = express.Router();
const axios = require("axios");
const { response } = require("express");
const SavedResultsFromAPI = require("../models/ApiResults.model");
const completedSearches = require("../models/CompletedSearches.model");

// set up async to avoid all of the nested then
router.get("/wines", async (req, res, next) => {
  console.log("great job on the post route!");
  const { limit, color, country } = req.query;

  const previousSearchResultsFromDB = await completedSearches
    // timestamp was in past 3 days to stay current
    // endpoint check if data is current
    // go ahead and raise the limit
    .findOne({
      limit,
      color,
      country,
    })
    .populate("wines");

  if (previousSearchResultsFromDB) {
    console.log("these results are from Mongo");
    res.render("wines", { wineInfo1: previousSearchResultsFromDB.wines });
  } else {
    const responseFromAPI = await axios.get(
      `https://api.globalwinescore.com/globalwinescores/latest/?country=${country}&color=${color}&limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: process.env.GWS_APIKEY,
        },
      }
    );
    const wineInfo1 = responseFromAPI.data.results;
    const createdWines = await SavedResultsFromAPI.create(wineInfo1);

    const wines = createdWines.map((wine) => wine._id);
    const savedRes = await completedSearches.create({
      limit,
      color,
      country,
      wines,
    });
    console.log({ savedRes });
    res.render("wines", { wineInfo1 });
  }
});

module.exports = router;
