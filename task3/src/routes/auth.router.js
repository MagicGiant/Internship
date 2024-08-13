const express = require("express");
const router = express.Router();

const pathCreator = require("../js/pathCreator");
const hasher = require("../js/hasher");
const User = require("../models/user");
const MessageRedirect = require("../js/messageRedirect")

module.exports = (repository, checker, passport) => {
  const passportUsage = require("../usage/passport.usage")(repository, checker);

  router.use(passportUsage.router);

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

  router.get('/log-out', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
  

  return router;
};
