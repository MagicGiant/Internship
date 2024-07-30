const TransformWithStrategies = require("./transformWithStrategies");

class TransformBuilder{
  constructor(strategies = []){
    this.strategies = strategies;
  }

  create(){
    return new TransformWithStrategies(this.strategies);
  }
}

module.exports = TransformBuilder;