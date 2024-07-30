const { Transform } = require('stream');
const Logger = require('../logger');

class TransformWithStrategies extends Transform{
  constructor(strategies = []){
    super();
    this.strategies = strategies;
  }

  _transform(chunk, encoding, callback) {
    try {
      let resultChunk = chunk.toString();
      for (let i = 0; i < this.strategies.length; i++) {
        resultChunk = this.strategies[i].change(resultChunk, this._strategyCallback);
      }
      this.push(resultChunk);
      callback();
    } catch (error) {
      callback(error);
    }
  }

  _strategyCallback(error = null){
    if (error){
      new Logger().addLog(`strategy error: ${error.message}`);
    }
  }
}

module.exports = TransformWithStrategies;