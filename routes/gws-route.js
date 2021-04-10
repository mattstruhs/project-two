const express = require("express");
const router = express.Router();
// const userCheck = require("../configs/user-check.config");
const axios = require('axios');
// const { eventNames } = require("../../lab-express-basic-auth/app");
// const wineDom = require("../public/js/wine")

router.get("/wines", (req, res, next) => {
    res.render("wines");
  });

<<<<<<< HEAD
  const countryInput = document.querySelector("#country-name");
//   const getCountryButton = document.querySelector("#get-country-button");
//   const flagImg = document.querySelector("#flag");
//   const countryNameH3 = document.querySelector("#country-name-h3");

  
  getCountryButton.addEventListener("click", () => {
    console.log("click");
    const countryName = countryInput.value;
    axios
      .get(`https://api.globalwinescore.com/globalwinescores/latest/${countryName}`)
      .then((responseFromAPI) => {
        console.log(responseFromAPI.data[0]);
        res.render("/wines", { wineList: winesFromAPI });
=======
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
>>>>>>> b570fa9d4b7bd418f15af64868ab17b21e8d3e37
      });

    module.exports = router;
