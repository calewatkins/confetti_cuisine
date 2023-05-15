const express = require('express');
const app = express();

const router = require('./routes/index');
const layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const connectFlash = require('connect-flash');
const expressValidator = require('express-validator');
const passport = require('passport');
const User = require("./models/user");

mongoose.Promise = global.Promise;

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/recipe_db",
  {useNewUrlParser: true}
);
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});
app.set("port", process.env.PORT || 3001);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);

app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));


app.use(express.json());
app.use(cookieParser("secret_passcode"));
app.use(expressSession({
  secret: "secret_passcode",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(connectFlash());   
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(expressValidator());

app.use("/", router);

const server = app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost: ${app.get("port")}`);
}),
  io = require("socket.io")(server);
require("./controllers/chatControllers")(io);