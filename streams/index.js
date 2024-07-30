const { getConfig } = require('./src/configReader');
const FileHandler = require('./src/fileHandler');
const Logger = require('./src/logger');
const Manager = require('./src/manager');
const {TransformToUpperCaseBuilder, ToUpperCase} = require('./src/transform/strategies/ToUpperCase');
const {TransformFilterBuilder} = require('./src/transform/strategies/Filter');
const path = require('path');
const TransformBuilder = require('./src/transform/transformBuilder');
const Filter = require('./src/transform/strategies/Filter');

async function f(){
  const configPath = path.join(__dirname, './src/Config.json');
  
  new Logger().clearLogs();
  new FileHandler(
      getConfig(configPath),
      new TransformBuilder([
        new Filter(getConfig(configPath)),
        new ToUpperCase()]))
    .processFiles();
}

f();