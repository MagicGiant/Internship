const fs = require('fs');

function getConfig(path){
  return JSON.parse(
    fs
    .readFileSync(path)
    .toString());
}

module.exports = {
  getConfig
}
  