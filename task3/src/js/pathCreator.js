const path = require("path");


const staticPath = path.resolve(__dirname, "../../static");


const createViewPath = (page) =>
  path.resolve(__dirname, "../../src/views", `${page}.ejs`);

module.exports = {
  path,
  staticPath,
  createViewPath
}