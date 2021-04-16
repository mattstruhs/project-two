// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");


// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// blahblah



// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

const path = require("path")
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(path.join(__dirname, "views/partials"))

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// require("../")
const projectName = "new-app";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with Ironlauncher`;

// global variable. create custom middleware to access req object and pass to layout
app.use((req, res, next) =>{
  res.locals.user = req.session.user;
  next();
});

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
// prepend any routh found in aithRoutes with /auth
app.use("/auth", authRoutes);

const wineRoutes = require("./routes/gws.route")
app.use("/", wineRoutes);

const journalRoutes = require("./routes/journal.route")
app.use("/", journalRoutes);

// const profileRoutes = require("./routes/profile.route")
// app.use("/", profileRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

// git pull
// git add .
// git commit -m 'descibe your commit'
// git push
//Ha ha , conflict!!!!
