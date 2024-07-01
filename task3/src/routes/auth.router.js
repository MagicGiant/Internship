const express = require("express");
var router = express.Router();

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const pathCreator = require("../../public/js/pathCreator");
const hasher = require('../../public/js/hasher');
const User = require('../models/user');




module.exports = (repository, checker) => {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      try {
        const user = await repository.getUserByName(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (!await hasher.checkPassword(password, user.password)) {
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
    } catch(err) {
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
  


  router.get("/log-in", (req, res) => {
    res.render(pathCreator.createViewPath("logIn"));
  });
  
  router.post(
    "/log-in",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/log-in",
      failureFlash: false,
    })
  );
  
  router.get("/sing-up", (req, res) => {
    res.render(pathCreator.createViewPath("singUp"));
  });
  
  router.post("/sing-up", async (req, res) => {
    if (req.body.password != req.body.secpassword) {
      res.send(MessageRedirect.passwordsMismatch("/sing-up"));
      return;
    }
  
    const user = new User(
      (await repository.getLastId()) + 1,
      req.body.username,
      await hasher.hashPassword(req.body.password)
    );
  
    if (await checker.checkingForUserAlreadyExistence(user)) {
      res.send(MessageRedirect.userAlreadyExistenceMessage("/sing-up"));
      return;
    }
  
    repository.addUser(user);
  
    res.redirect("/");
  });
  
  router.post("/log-out", (req, res) =>{
    checker.isLogIn = false;
    res.redirect("/");
  });

  return router;
}