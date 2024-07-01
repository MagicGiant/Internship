const express = require("express");
let router = express.Router();

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const hasher = require("../../public/js/hasher");

module.exports = (repository, checker) => {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      try {
        const user = await repository.getUserByName(username);
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
      const user = await repository.getUserById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  router.use(
    session({
      secret: "asdjsdaqjwhegfbjbdjsayeglrjhbqwyf",
      resave: false,
      saveUninitialized: false,
    })
  );
  router.use(passport.initialize());
  router.use(passport.session());

  return {
    router,
    passport,
  };
};
