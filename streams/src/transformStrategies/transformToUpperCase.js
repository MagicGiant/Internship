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

class TransformToUpperCaseBuilder{
  create(){
    return new TransformToUpperCase();
  }
}

module.exports ={
  TransformToUpperCase,
  TransformToUpperCaseBuilder
}