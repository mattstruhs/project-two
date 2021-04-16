const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal.model");
// const axios = require("axios");
// const userCheck = require("../config/user-check.config");

router.get("/journal", (req, res, next) => {
  // get all the entries from DB
  console.log("your at the journal index page", req.query);
  res.render("journal/index");
//   Journal.find({})
//     .then((journalFromDB) => {
//       res.render("journal/index.hbs", { journalFromDB });
//     })
//     .catch((err) => next(err));
});

module.exports = router;