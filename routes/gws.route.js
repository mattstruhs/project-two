const express = require("express");
const router = express.Router();
// const userCheck = require("../configs/user-check.config");
const axios = require('axios');
// const { eventNames } = require("../../lab-express-basic-auth/app");
// const wineDom = require("../public/js/wine")

router.get("/wines", (req, res, next) => {
    res.render("wines");
  });

router.post("/wines", (req, res, next) => {
    console.log("great job on the post route!")
    // axios
    //   .get(`https://api.globalwinescore.com/globalwinescores/latest/${wineDom.countryName}`, {
    //       headers: {
    //         Accept: application/json,
    //         Authorization: process.env.GWS_APIKEY
    //       }
    //     })
    //   .then((responseFromAPI) => {
    //     console.log(responseFromAPI.data[0]);
    //     res.render("/wines", {wineList: winesFromAPI});
      });

    module.exports = router;
