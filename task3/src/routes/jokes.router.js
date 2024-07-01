const express = require("express");
const router = express.Router();

const joke = require("../../public/js/joke");
const MessageRedirect = require("../../public/js/messageRedirect");
const pathCreator = require("../../public/js/pathCreator");

module.exports = (checker) =>{
  router.get("/", async (req, res) => {
    if (!checker.isLogIn) {
      res.send(MessageRedirect.doesNotLogInMessage("/"));
      return;
    }

    const jokes = await joke.getJokes(5);
    res.render(pathCreator.createViewPath("jokes"), { jokes });
  });

  return router;
}
