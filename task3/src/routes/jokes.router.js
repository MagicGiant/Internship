const express = require("express");
const router = express.Router();

const joke = require("../js/joke");
const MessageRedirect = require("../js/messageRedirect");
const pathCreator = require("../js/pathCreator");

module.exports = (checker) => {
  router.get("/", checker.ensureAuthenticated, async (req, res) => {

    const jokes = await joke.getJokes(5);
    res.render(pathCreator.createViewPath("jokes"), { jokes });
  });

  return router;
};
