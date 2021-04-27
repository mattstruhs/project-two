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
      avgRating: 0,
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

// assign a value for all of the notes created by the user, so we can filter in hbs
router.get("/journal/:wineID/edit", userCheck, async (req, res, next) => {
  const wineInfoFromDB = await SavedResultsFromAPI.findById(
    req.params.wineID
  ).populate("notes");
  const notesArray = wineInfoFromDB.notes;
  notesArray.forEach((notes) => {
    if (notes.user.equals(req.session.user._id)) {
      console.log("this is my note");
      notes.isMyNote = true;
      wineInfoFromDB.alreadyReviewed = true;
    } else {
      notes.isMyNote = false;
    }
  });

  res.render("journal/edit", {
    wineInfoFromDB: wineInfoFromDB,
    userID: req.session.user._id,
  });
});

// create tasting notes and save the note id to the user in an array
// we will also keep track of notes for each respective wine in an array
// add user to req.body
router.post("/journal/:wineID/edit", userCheck, async (req, res, next) => {
  req.body.user = req.session.user._id;
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
  res.redirect("/journal");
});

// step one: save rating to rating DB
// step one-b: save rating id to user model
// step two: save rating to wine DB
// step three: findbyID all ratins for specific wine
// step four: exctract and calculate average
// step five: save updated avg to wine with new rating entry
router.post("/journal/:wineID/rating", userCheck, async (req, res, next) => {
  resultsFromCreateRating = await Rating.create({
    ...req.body,
    wine_id: req.params.wineID,
    user: req.session.user._id,
  });

  console.log("results from creating ratings", resultsFromCreateRating);

  const ratingID = resultsFromCreateRating._id;
  console.log("checking ratingID", ratingID);

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

  // ------ calculate average rating with newly submitted rating
  const resultsFromDB = await SavedResultsFromAPI.findById(
    req.params.wineID
  ).populate({
    path: "ratings",
    populate: {
      path: "ratings",
      model: "Rating",
    },
  });

  console.log("checking resultsFromDB", resultsFromDB);
  const ratingsArray = resultsFromDB.ratings;

  console.log("checking ratingsArray", ratingsArray);

  let ratingValues = [];
  ratingsArray.forEach((rating) => {
    console.log(rating);
    ratingValues.push(rating.rating);
  });
  const sumOfRating = ratingValues.reduce((a, v) => {
    return a + v;
  }, 0);
  console.log("check the sumOfRating", sumOfRating);
  const newAverageRating = sumOfRating / ratingValues.length;
  console.log("check the avg", newAverageRating);
  // ------

  const checkResults = await SavedResultsFromAPI.findByIdAndUpdate(
    req.params.wineID,
    {
      avgRating: newAverageRating.toFixed(2),
    },
    { new: true }
  );

  console.log(
    "check if new average was saved to wines model",
    checkResults.avgRating
  );

  res.redirect("/journal");
});

module.exports = router;
