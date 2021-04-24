const express = require("express");
const router = express.Router();
const axios = require("axios");
const { response } = require("express");
const SavedResultsFromAPI = require("../models/ApiResults.model");
const completedSearches = require("../models/CompletedSearches.model");

// set up async to avoid all of the nested .then
// each operations must complete before moving on to the next
router.get("/wines", async (req, res, next) => {
  console.log(
    "Got your search paramaters! Let's see if we have done this search before."
  );
  const { limit, color, country } = req.query;

  // check to see if we have done this search before
  const previousSearchResultsFromDB = await completedSearches
    // timestamp was in past 3 days to stay current
    // endpoint check if data is current
    // go ahead and raise the limit
    // keyword search of wine title
    .findOne({
      limit,
      color,
      country,
    })
    .populate("wines");

  if (previousSearchResultsFromDB) {
    console.log(
      "We've already saved these results from a previous search! Here are the results from Mongo"
    );
    const copyOne = previousSearchResultsFromDB.wines;

    copyOne.forEach((wine) => {
      wine.users.forEach((user) => {
        if (user.equals(req.session.user._id)) {
          wine.inMyCollection = true;
        }
      });
    });

    res.render("wines", { wineInfo1: previousSearchResultsFromDB.wines });
  } else {
    console.log(
      "No luck on finding the results in our DB. Making the request from the api now!"
    );
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
    wineInfo1.journal = req.session.user._id;
    console.log("testing wineInfo1 users", wineInfo1.users);

    console.log(
      "We got the results back from the api request! Storing them now for future reference!"
    );
    const createdWines = await SavedResultsFromAPI.create(wineInfo1);

    // store just the wine ids so we can store them in our previous searches model
    const wines = createdWines.map((wine) => wine._id);

    // save the search paramaters so next time we can see if this search has been done before
    // we use the list of wine ids (wines) to link between previous searches and our full results from api
    console.log(
      "Storing the search parameters from our request so we can keep track of our searches"
    );
    const savedRes = await completedSearches.create({
      limit,
      color,
      country,
      wines,
    });
    console.log("these are the results we saved", savedRes);
    res.render("wines", { wineInfo1: createdWines });
  }
});

module.exports = router;
