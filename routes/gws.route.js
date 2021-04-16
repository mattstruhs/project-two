const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/wines", (req, res, next) => {
  console.log("great job on the post route!");
  let limitResults = req.query.limitResults;
  let color = req.query.color;
  let country = req.query.country;
  axios
    .get(
      `https://api.globalwinescore.com/globalwinescores/latest/?
      country=${country}&
      color=${color}&
      limit=${limitResults}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: process.env.GWS_APIKEY,
        },
      }
    )
    .then((responseFromAPI) => {
      wineInfo = responseFromAPI.data.results;
      console.log(wineInfo);
      res.render("wines", { wineInfo });
    });
});
module.exports = router;
