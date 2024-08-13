const express = require("express");
const router = express.Router();

const pathCreator = require("../js/pathCreator");
const static = require("../js/static");
const MessageRedirect = require("../js/messageRedirect");

module.exports = (checker) => {
  router.get("/", (req, res) => {
    static.renderPath(res, pathCreator.staticPath, checker.isLogIn);
  });

  router.get("/*", checker.ensureAuthenticated,(req, res) => {
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
};
