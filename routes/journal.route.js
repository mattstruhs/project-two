const express = require("express");
const router = express.Router();
const userCheck = require("../config/user-check.config");
const Rating = require("../models/StarRating.model");
const SavedResultsFromAPI = require("../models/ApiResults.model");
const User = require("../models/User.model");
const TastingNotes = require("../models/TastingNotes.model");

// the user model keeps track of wine id and ratings id in respective arrays
// populate them to access the details about each wine or rating
router.get("/journal", userCheck, async (req, res, next) => {
  const userFromDB = await User.findById(req.session.user._id).populate([
    {
      path: "journal",
      populate: {
        path: "ratings",
        model: "Rating",
      },
    },
    {
      path: "ratings",
      populate: {
        path: "wine_id",
        model: "SavedResultsFromAPI",
      },
    },
  ]);

  res.render("journal/index", {
    journalFromDB: userFromDB.journal,
    userRatingsFromDB: userFromDB.ratings,
  });
});

// add a wine to a user's journal
// we store the wine id to the users model in an array
// we also store id of each user that has added wine to journal in the saved wines model
router.post("/journal", userCheck, async (req, res, next) => {
  await User.findByIdAndUpdate(req.session.user._id, {
    $push: { journal: req.body.wineID },
  });
  await SavedResultsFromAPI.findByIdAndUpdate(
    req.body.wineID,
    {
      $push: { users: req.session.user._id },
    },
    { new: true }
  );
  res.redirect("/journal");
});

// delete a wine from a users journal by removing the wine id from the users model
// and user id from the saved wines model
router.post("/journal/:wineID/delete", userCheck, async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.session.user._id,
    {
      $pull: { journal: req.params.wineID },
    },
    { new: true }
  );
  await SavedResultsFromAPI.findByIdAndUpdate(
    req.body.wineID,
    {
      $pull: { users: req.session.user._id },
    },
    { new: true }
  );
  res.redirect("/journal");
});

// we only want to see the users tasting notes and populate them to pass through notesCard
router.get("/journal/:wineID/edit", userCheck, async (req, res, next) => {
  const wineInfoFromDB = await SavedResultsFromAPI.findById(
    req.params.wineID
  ).populate("notes");
  res.render("journal/edit", { wineInfoFromDB });
});

// create tasting notes and save the note id to the user in an array
// we will also keep track of notes for each respective wine in an array
router.post("/journal/:wineID/edit", userCheck, async (req, res, next) => {
  const notesInfoFromDB = await TastingNotes.create(req.body);
  await User.findByIdAndUpdate(
    req.session.user._id,
    {
      $push: { notes: notesInfoFromDB._id },
    },
    { new: true }
  );
  const wineInfoFromDB = await SavedResultsFromAPI.findByIdAndUpdate(
    req.params.wineID,
    {
      $push: { notes: notesInfoFromDB._id },
    },
    { new: true }
  ).populate("notes");
  res.render("journal/edit", { wineInfoFromDB });
});

// create new rating, keep track of the users rating in the users model, and each wine keeps track of it's ratings
router.post("/journal/:wineID/rating", userCheck, async (req, res, next) => {
  const resultsFromDB = await Rating.create({
    ...req.body,
    wine_id: req.params.wineID,
    user: req.session.user._id,
  });
  const ratingID = resultsFromDB._id;
  await User.findByIdAndUpdate(
    req.session.user._id,
    {
      $push: { ratings: ratingID },
    },
    { new: true }
  );
  await SavedResultsFromAPI.findByIdAndUpdate(
    req.params.wineID,
    {
      $push: { ratings: ratingID },
    },
    { new: true }
  );
  await SavedResultsFromAPI.findById(req.params.wineID).populate({
    path: "ratings",
    populate: {
      path: "ratings",
      model: "Rating",
    },
  });

  // look at calculating the average rating with the new rating just created
  // update the average rating in the saved wines model

  res.redirect("/journal");
});

module.exports = router;
