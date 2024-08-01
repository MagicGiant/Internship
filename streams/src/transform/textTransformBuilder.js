const TextTransform = require("./textTransform");

class TextTransformBuilder{
  constructor(config, combinedStrategiesBuilders = [], splitStrategiesBuilders = []){
    this.combinedStrategiesBuilders = combinedStrategiesBuilders;
    this.splitStrategiesBuilders = splitStrategiesBuilders;
    this.config = config;
  }

  create(){
    return new TextTransform(this.config, this.combinedStrategiesBuilders, this.splitStrategiesBuilders);
  }
}

module.exports = TextTransformBuilder;