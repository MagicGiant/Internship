const { Transform } = require('stream');

class TransformToUpperCase extends Transform{
  constructor() {
    super();
  }

  _transform(chunk, encoding, callback) {
    try {
      this.push(chunk.toString().toUpperCase());
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

module.exports = TransformToUpperCase;