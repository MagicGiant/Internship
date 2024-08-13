const express = require("express");
let router = express.Router();

const passport = require("passport");
const session = require("express-session");

const hasher = require("../js/hasher");

module.exports = (repository, checker) => {
  

  return {
    router,
    passport,
  };
};
