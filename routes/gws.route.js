const express = require("express");
const router = express.Router();
// const userCheck = require("../configs/user-check.config");
const axios = require("axios");
// const { eventNames } = require("../../lab-express-basic-auth/app");
// const wineDom = require("../public/js/wine")

// router.get("/wines", (req, res, next) => {
//     res.render("wines");
//   });

router.get("/wines", (req, res, next) => {
  console.log("great job on the post route!");
  let limitResults = req.query.limitResults;
  // let vintage = req.query.vintage;
  let color = req.query.color;
  // let region = req.query.region[0];
  let country = req.query.country;
  // let score = req.query.score;
  // let appellation = req.query.appellation;

  console.log(country, color, limitResults);
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
