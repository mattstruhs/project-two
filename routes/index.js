const router = require("express").Router();
const User = require("../models/User.model");
// require cloudinary setup which allow us to create images on cloudinary and pass url once we do to the next route
const cloudinaryUpload = require("../config/cloudinary.config");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", (req, res, next) => {
  console.log("profile", req.session.user);
  res.render("profile", req.session.user);
});

// create an image and store the URL in the User Model
router.post("/profile", cloudinaryUpload.single("image"), (req, res, next) => {
  console.log(req.file.path);
  // req session is something
  User.findOneAndUpdate(
    {
      username: req.session.user.username,
    },
    { profileImg: req.file.path },
    { new: true }
  ).then((userFromDB) => {
    console.log(userFromDB);
    userFromDB.password = "";
    req.session.user = userFromDB;
    res.render("profile");
  });
});

module.exports = router;
