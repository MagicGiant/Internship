const { getConfig } = require('./src/configReader');
const FileHandler = require('./src/fileHandler');
const Logger = require('./src/logger');
const {ToUpperCase, ToUpperCaseBuilder} = require('./src/transform/strategies/ToUpperCase');
const path = require('path');
const {Filter, FilterBuilder} = require('./src/transform/strategies/Filter');
const TextTransformBuilder = require('./src/transform/textTransformBuilder');
const { AddLineNumber, AddLineNumberBuilder } = require('./src/transform/strategies/AddLineNumber');

async function f(){
  const configPath = path.join(__dirname, './src/Config.json');
  const config = getConfig(configPath);
  new Logger().clearLogs();
  new FileHandler(
      config,
      new TextTransformBuilder(
        config,
        [
          new FilterBuilder(config),
          new ToUpperCaseBuilder(),
          // new AddLineNumberBuilder()
        ]))
    .processFiles();
}

f();