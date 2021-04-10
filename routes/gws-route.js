const express = require("express");
const router = express.Router();
const userCheck = require("../configs/user-check.config");
const axios = require('axios');
// const Celebrity = require("../models/celebrity.model");
// const Movie = require("../models/movie.model");

router.get("/celebrities", (req, res, next) => {
  // get all the entries from DB
  console.log("query", req.query);
  Celebrity.find({})
    .then((celebritiesFromDB) => {
      // pass the object which have the property name celebritiesFromDB
      // this will affect how we are refering to the properties in the hbs file
      res.render("celebrities/index.hbs", { celebritiesFromDB });
    })
    .catch((err) => next(err));
});


const instance = axios.create({
    baseURL: "https://api.globalwinescore.com/globalwinescores/latest/",
  });


