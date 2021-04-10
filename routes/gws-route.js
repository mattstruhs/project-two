const express = require("express");
const router = express.Router();
const userCheck = require("../configs/user-check.config");
const axios = require('axios');


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
        res.render("/wines", wineList: winesFromAPI);
      });
  });
