const Manager = require('./src/manager');
const TransformToUpperCase = require('./src/transformStrategies/transformToUpperCase');
const path = require('path')

async function f(){
  const configPath = path.join(__dirname, './src/Config.json');
  const transformToUpperCase = new TransformToUpperCase();

  console.log(new Manager(configPath).getConfig(), transformToUpperCase);

  
}

f();