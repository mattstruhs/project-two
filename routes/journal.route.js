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
  const update = {...req.body};
  console.log({ update })
  update.wine_id = update.wine_id.toString() + update.vintage.toString()  

  console.log(req.body)
  Journal.create(update)
    .then(() => {
      res.redirect("/journal");
    })
    .catch((err) => next(err));
});


router.post("/journal/:wineID/delete", userCheck, (req, res, next) => { 
  console.log("post delete route", req.params)
    Journal.findByIdAndRemove(req.params.wineID)
      .then(() => {
        res.redirect("/journal");
      })
      .catch((err) => next(err));
  });

  router.get("/journal/:wineID/edit", userCheck, (req, res, next) => { 
    console.log("get edit route", req.params)
      Journal.findById(req.params.wineID)
        .then((resultsFromDB) => {
          res.render("journal/edit", resultsFromDB );
        })
        .catch((err) => next(err));
    });

  router.post("/journal/:wineID/edit", userCheck, (req, res, next) => { 
    console.log("post edit route", req.params)
    console.log(req.body)
      Journal.findByIdAndUpdate(req.params.wineID, req.body)
        .then(() => {
          res.redirect("/journal" );
        })
        .catch((err) => next(err));
    });
  
    router.get("/journal/new", userCheck, (req, res, next) => {
      res.render("journal/new.hbs")
    });

    router.post("/journal/new", userCheck, (req, res, next) => { 
      console.log("post create new route", req.params)
      console.log(req.body)
        Journal.create(req.body)
          .then(() => {
            res.redirect("/journal" );
          })
          .catch((err) => next(err));
      });
    


module.exports = router;
