const { Transform } = require('stream');

class TransformWithStrategies extends Transform{
  constructor(strategies = []){
    super();
    this.strategies = strategies;
  }

  _transform(chunk, encoding, callback) {
    try {
      let resultChunk = chunk.toString();
      for (let i = 0; i < this.strategies.length; i++) {
        resultChunk = this.strategies[i].change(resultChunk);
      }
      this.push(resultChunk);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

module.exports = TransformWithStrategies;