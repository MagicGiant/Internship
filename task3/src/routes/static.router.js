const express = require("express");
let router = express.Router();

const pathCreator = require("../../public/js/pathCreator");
const static = require("../../public/js/static");

module.exports = (checker) => {
  router.get("/", (req, res) => {
    static.renderPath(res, pathCreator.staticPath, checker.isLogIn);
  });
  
  router.get("/*", (req, res) => {
    if (!checker.isLogIn) {
      res.send(MessageRedirect.doesNotLogInMessage("/"));
      return;
    }
    const fileDirPath = pathCreator.path.join(
      pathCreator.staticPath,
      req.params[0]
    );
  
    static.renderPath(res, fileDirPath, checker.isLogIn);
  });
  
  router.use((req, res) => {
    let redirectPath = "/";
    console.log(`Invalid link. Redirect to "${redirectPath}"`);
    res.redirect(redirectPath);
  });

  return router;
}