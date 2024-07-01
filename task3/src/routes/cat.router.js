const express = require("express");
const router = express.Router();

const cat = require("../../public/js/cat");
const MessageRedirect = require("../../public/js/messageRedirect");
const pathCreator = require("../../public/js/pathCreator");

module.exports = (checker) => {
  router.get("/", async (req, res) => {
    if (!checker.isLogIn) {
      res.send(MessageRedirect.doesNotLogInMessage("/"));
      return;
    }
    const catUrl = await cat.getRandomCatUrl();
    res.render(pathCreator.createViewPath("cat"), { catUrl });
  });

  return router;
}