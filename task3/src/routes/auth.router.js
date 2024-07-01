const express = require("express");
const router = express.Router();

const pathCreator = require("../../public/js/pathCreator");
const hasher = require('../../public/js/hasher');
const User = require('../models/user');


module.exports = (repository, checker) => {

  const passportUsage = require('../usage/passport.usage')(repository, checker);

  router.use(passportUsage.router);

  router.get("/log-in", (req, res) => {
    res.render(pathCreator.createViewPath("logIn"));
  });
  
  router.post(
    "/log-in",
    passportUsage.passport.authenticate("local", {
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