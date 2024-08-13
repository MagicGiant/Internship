const express = require("express");
const router = express.Router();

const cat = require("../js/cat");
const MessageRedirect = require("../js/messageRedirect");
const pathCreator = require("../js/pathCreator");

module.exports = (checker) => {
  router.get("/", checker.ensureAuthenticated, async (req, res) => {
    const catUrl = await cat.getRandomCatUrl();
    res.render(pathCreator.createViewPath("cat"), { catUrl });
  });

  return router;
};
