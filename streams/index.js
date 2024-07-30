const { getConfig } = require('./src/configReader');
const FileHandler = require('./src/fileHandler');
const Logger = require('./src/logger');
const Manager = require('./src/manager');
const {TransformToUpperCaseBuilder} = require('./src/transformStrategies/transformToUpperCase');
const path = require('path')

async function f(){
  const configPath = path.join(__dirname, './src/Config.json');
  
  new Logger().clearLogs();
  new FileHandler(getConfig(configPath), new TransformToUpperCaseBuilder()).processFiles();
}

f();