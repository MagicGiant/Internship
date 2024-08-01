const TextTransform = require("./textTransform");

class TextTransformBuilder{
  constructor(combinedStrategiesBuilders = [], splitStrategiesBuilders = []){
    this.combinedStrategiesBuilders = combinedStrategiesBuilders;
    this.splitStrategiesBuilders = splitStrategiesBuilders;
  }

  create(config, logger){
    return new TextTransform(config, logger, this.combinedStrategiesBuilders, this.splitStrategiesBuilders);
  }
}

module.exports = TextTransformBuilder;