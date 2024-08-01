const fs = require('fs');

function getConfig(path){
  let config = JSON.parse(
    fs
    .readFileSync(path)
    .toString());

  const maxStr = _getMaxStringFromArray(config.filterKeywords);

  let encoder = new TextEncoder();
  let byteArray = encoder.encode(maxStr);
  let totalBytes = byteArray.length;
  
  if (config.filterKeywords.length != 0 && config.highWaterMark < totalBytes){
    config.highWaterMark = totalBytes;
  }

  return config;
}

function _getMaxStringFromArray(arr){
  return  arr.reduce((a, b) => {return a.length > b.length ? a : b;});
}

module.exports = {
  getConfig
}
  