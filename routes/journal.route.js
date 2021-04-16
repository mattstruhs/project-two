const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal.model");
// const axios = require("axios");
const userCheck = require("../config/user-check.config");

router.get("/journal", userCheck, (req, res, next) => {
  // get all the entries from DB
  Journal.find({})
    .then((journalFromDB) => {
      res.render("journal/index.hbs", { journalFromDB });
    })
    .catch((err) => next(err));
});

router.post("/journal", userCheck, (req, res, next) => {
  // get info from api about wine
  const {
    wine_id,
    wine,
    vintage,
    appellation,
    color,
    regions,
    country,
    score,
    writeUp,
  } = req.body;
  console.log(req.body)
  Journal.create(req.body)
    .then(() => {
      res.render("journal/index.hbs");
    })
    .catch((err) => next(err));
});

module.exports = router;
