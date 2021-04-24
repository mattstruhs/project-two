const express = require("express");
const router = express.Router();
const Rating = require("../models/StarRating.model");
const SavedResultsFromAPI = require("../models/ApiResults.model");
const userCheck = require("../config/user-check.config");
const User = require("../models/User.model");

router.get("/journal", userCheck, async (req, res, next) => {
  // get all the entries from DB
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
    infoFromDB: userFromDB
  });
});

router.post("/journal", userCheck, async (req, res, next) => {
  // add the wineid to the users model
  await User.findByIdAndUpdate(req.session.user._id, {
    $push: { journal: req.body.wineID },
  })

  const testJournalAdd = await SavedResultsFromAPI.findByIdAndUpdate(req.body.wineID, {
    $push: { users: req.session.user._id },
  }, {new: true})

  console.log("testing users in testJournalAdd", testJournalAdd)
    // .then(() => {
      res.redirect("/journal");
      // res.redirect("wines");
    // })
    // .catch((err) => next(err));
});

router.post("/journal/:wineID/delete", userCheck, (req, res, next) => {
  console.log("post delete route", req.params);
  User.findByIdAndUpdate(req.session.user._id, {
    $pull: { journal: req.params.wineID },
  })
    .then(() => {
      res.redirect("/journal");
    })
    .catch((err) => next(err));
});

router.get("/journal/:wineID/edit", userCheck, (req, res, next) => {
  console.log("get edit route", req.params);
  SavedResultsFromAPI.findById(req.params.wineID)
    .then((resultsFromDB) => {
      // console.log("this is what we are passing to edit", resultsFromDB);
      res.render("journal/edit", resultsFromDB);
    })
    .catch((err) => next(err));
});

// we need to discuss if these notes are just for user or made global
router.post("/journal/:wineID/edit", userCheck, (req, res, next) => {
  console.log("post edit route", req.params);
  // console.log(req.body);
  Journal.findByIdAndUpdate(req.params.wineID, req.body)
    .then(() => {
      res.redirect("/journal");
    })
    .catch((err) => next(err));
});

router.post("/journal/:wineID/rating", userCheck, async (req, res, next) => {
  console.log("saving a new rating to star-ratings");
  const resultsFromDB = await Rating.create({
    ...req.body,
    wine_id: req.params.wineID,
    user: req.session.user._id,
  });

  const reviewVar = resultsFromDB._id
  console.log(reviewVar)
  const testOne = await User.findByIdAndUpdate(req.session.user._id, {
    $push: { ratings: reviewVar },
  }, {new: true});

  const testTwo = await SavedResultsFromAPI.findByIdAndUpdate(req.params.wineID, {
    $push: { ratings: reviewVar},
  }, {new: true});
  
  // find all of the ratings for this wine
  // avg calc
  // findbyidandupdate
  const savedWines = await SavedResultsFromAPI.findById(req.params.wineID).populate(    {
    path: "ratings",
    populate: {
      path: "ratings",
      model: "Rating",
    },
  },)
  

  console.log("checking saved wine", savedWines)
  // let sumRating = 0;
  // let result = await resultsFromDB.ratings.forEach((element) => {
  //   console.log(element.rating, sumRating);
  //   sumRating += element.rating;
  // });
  // let averageRating = (sumRating / userFromDB.ratings.length).toFixed(2);

  res.redirect("/journal");
});

// router.post("/journal/:wineID/rating", userCheck, (req, res, next) => {
//   console.log("saving your rating to the ratings model", req.params.wineID);
//   console.log({
//     ...req.body,
//     wine_id: req.params.wineID,
//     user: req.session.user._id,
//   });

//   Rating.create({
//     ...req.body,
//     wine_id: req.params.wineID,
//     user: req.session.user._id,
//   })
//     .then((resultsFromDB) => {
//       console.log("saving review to the saved api results model", { ratings: resultsFromDB._id } )
//       SavedResultsFromAPI.findByIdAndUpdate(req.param.wineID, {
//         $push: { ratings: resultsFromDB._id },
//       })
//       .then(() => {
//         console.log("saving review to the user's model", { ratings: resultsFromDB._id } )
//         User.findByIdAndUpdate(req.param.wineID, {
//           $push: { ratings: resultsFromDB._id },
//         })
//         .then(() => {
//           res.redirect("/journal" );
//         });
//       });
//     })
//     .catch((err) => next(err));
// });

// router.get("/journal/new", userCheck, (req, res, next) => {
//   res.render("journal/new.hbs");
// });

// router.post("/journal", userCheck, (req, res, next) => {
//   console.log("post create new route", req.params);
//   console.log(req.body);
//   Journal.create(req.body)
//     .then(() => {
//       res.redirect("/journal");
//     })
//     .catch((err) => next(err));
// });

module.exports = router;
