const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal.model");
// const axios = require("axios");
const userCheck = require("../config/user-check.config");

router.get("/journal", userCheck, (req, res, next) => {
  // get all the entries from DB
  res.render("journal/index");
//   Journal.find({})
//     .then((journalFromDB) => {
//       res.render("journal/index.hbs", { journalFromDB });
//     })
//     .catch((err) => next(err));
});

module.exports = router;