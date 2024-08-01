const TextTransform = require("./textTransform");

class TextTransformBuilder{
  constructor(config, strategies = []){
    this.strategies = strategies;
    this.config = config;
  }

  create(){
    
    return new TextTransform(this.config, this.strategies);
  }
}

module.exports = TextTransformBuilder;