"use strict";

const express = require("express");
const Checker = require("./src/js/checker");
const Database = require("./src/db/database");
const UserRepository = require("./src/repository/user.repository");
const LocalStrategy = require("passport-local").Strategy;
const hasher = require("./src/js/hasher");
const app = express();

const authRouter = require("./src/routes/auth.router");
const staticRouter = require("./src/routes/static.router");
const jokesRouter = require("./src/routes/jokes.router");
const catRouter = require("./src/routes/cat.router");
const session = require('express-session');
const passport = require("passport");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const database = Database.getDatabaseFromObject({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "fileManager",
  password: "1239"
});

app.use(
  session({
    secret: "asdjsdaqjwhegfbjbdjsayeglrjhbqwyf",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const userRepository = new UserRepository(database);
userRepository.createTableIfNotExists();

const checker = new Checker(userRepository);

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await userRepository.getUserByName(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!(await hasher.checkPassword(password, user.password))) {
        return done(null, false, { message: "Incorrect password." });
      }
      checker.isLogIn = true;
      return done(null, user);
    } catch (err) {
      if (err) {
        return done(err);
      }
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await userRepository.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


const PORT = 3000;

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
});

app.use("/auth", authRouter(userRepository, checker, passport));

app.use("/cat", catRouter(checker));

app.use("/jokes", jokesRouter(checker));

app.use("/", staticRouter(checker));
