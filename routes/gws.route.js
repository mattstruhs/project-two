const express = require("express");
const router = express.Router();
const axios = require("axios");
const { response } = require("express");

router.get("/wines", (req, res, next) => {
  console.log("great job on the post route!");
  let limit = req.query.limit;
  let color = req.query.color;
  let country = req.query.country;
  // if we already have it then get it from mongo
  // else do the axio
  console.log(country)

  axios
    .get(
      `https://api.globalwinescore.com/globalwinescores/latest/?country=${country}&color=${color}&limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: process.env.GWS_APIKEY,
        },
      }
    )
    .then((responseFromAPI) => {
      // save results to database for next search
      let wineInfo1 = responseFromAPI.data.results;
      // console.log(wineInfo1);
      res.render("wines", { wineInfo1 });
    }).catch((err)=>{
      console.log(err)
    });
});
module.exports = router;
