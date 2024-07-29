const configReader = require('./configReader');

class Manager{
  constructor(configPath, transformStrategy = null){
    this.transformStrategy = transformStrategy;
    this.configPath = configPath;
  }

  getConfig(){
    return configReader.getConfig(this.configPath);
  }
}

module.exports = Manager;