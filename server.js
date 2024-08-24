require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// ----------
// MIDDLEWARE
// ----------

app.use(morgan('dev'));
app.use(express.static('public'));
// express.urlencoded is what creates req.body
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', './views');

// Require the middleware that adds the user doc to the req & the res.locals objects
const addUserToReqAndLocals = require('./middleware/addUserToReqAndLocals');
// Be sure to mount after the session middleware above
app.use(addUserToReqAndLocals);

// --------------------
// ROUTES / CONTROLLERS
// --------------------

const ensureLoggedIn = require('./middleware/ensureLoggedIn');
const songsController = require('./controllers/songs');

app.use('/auth', require('./controllers/auth'));

// GET / (root/landing page)
app.get('/', async (req, res) => {
  res.render('home.ejs');
});

app.use('/songs', songsController); 


// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
// An alternative to above
// const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
