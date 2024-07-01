const fs = require("fs");

const pathCreator = require('./pathCreator');


const renderPath = async (res, fileDirPath, isLogIn = false) => {
  fs.stat(fileDirPath, (err, stats) => {
    if (err) {
      console.log(err);
      return res.status(404).send("File or directory not found");
    }

    if (stats.isFile()) {
      res.sendFile(fileDirPath);
    } else {
      fs.readdir(fileDirPath, (err, files) => {
        if (err) {
          console.error("Error reading static directory", err);
          return res.status(500).send("Server error");
        } else res.render(pathCreator.createViewPath("index"), { files , isLogIn});
      });
    }
  });
};

module.exports = {
  renderPath
}