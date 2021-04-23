const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal.model");
const Rating = require("../models/StarRating.model");
const SavedResultsFromAPI = require("../models/ApiResults.model");
// const axios = require("axios");
const userCheck = require("../config/user-check.config");
const User = require("../models/User.model");

router.get("/journal", userCheck, (req, res, next) => {
  // get all the entries from DB
  User.findById(req.session.user._id).populate("journal ratings")
    .then((userFromDB) => {
      console.log("wines in the journal", userFromDB.journal)
      res.render("journal/index.hbs", { journalFromDB: userFromDB.journal });
    })
    .catch((err) => next(err));
});

router.post("/journal", userCheck, (req, res, next) => {
  // get info from api about wine
  // const update = { ...req.body };
  // update.wine_id = update.wine_id.toString() + update.vintage.toString();

  console.log(req.body.wineID)
  User.findByIdAndUpdate(req.session.user._id, { $push: {journal: req.body.wineID }})
    .then(() => {
      res.redirect("/journal");
    })
    .catch((err) => next(err));
});

router.post("/journal/:wineID/delete", userCheck, (req, res, next) => {
  console.log("post delete route", req.params);
  User.findByIdAndUpdate(req.session.user._id, { $pull: {journal: req.params.wineID }})
    .then(() => {
      res.redirect("/journal");
    })
    .catch((err) => next(err));
});

router.get("/journal/:wineID/edit", userCheck, (req, res, next) => {
  console.log("get edit route", req.params);
  SavedResultsFromAPI.findById(req.params.wineID)
    .then((resultsFromDB) => {
      res.render("journal/edit", resultsFromDB);
    })
    .catch((err) => next(err));
});

// we need to discuss if these notes are just for user or made global
router.post("/journal/:wineID/edit", userCheck, (req, res, next) => {
  console.log("post edit route", req.params);
  console.log(req.body);
  Journal.findByIdAndUpdate(req.params.wineID, req.body)
    .then(() => {
      res.redirect("/journal");
    })
    .catch((err) => next(err));
});

router.post("/journal/:wineID/rating", userCheck, (req, res, next) => {
  console.log("saving your rating for the wine", req.params.wineID);
  console.log({
    ...req.body,
    wine_id: req.params.wineID,
    user: req.session.user._id,
  });

  Rating.create({
    ...req.body,
    wine_id: req.params.wineID,
    user: req.session.user._id,
  })
    .then((resultsFromDB) => {
      SavedResultsFromAPI.findByIdAndUpdate(req.param.wineID, {
        $push: { ratings: resultsFromDB._id },
      }).then(() => {
        User.findByIdAndUpdate(req.param.wineID, {
          $push: { ratings: resultsFromDB._id },
        }).then(() => {
          res.redirect("/journal" );
        });
      });
    })
    .catch((err) => next(err));
});


// router.get("/journal/new", userCheck, (req, res, next) => {
//   res.render("journal/new.hbs");
// });

// router.post("/journal/new", userCheck, (req, res, next) => {
//   console.log("post create new route", req.params);
//   console.log(req.body);
//   Journal.create(req.body)
//     .then(() => {
//       res.redirect("/journal");
//     })
//     .catch((err) => next(err));
// });

module.exports = router;
