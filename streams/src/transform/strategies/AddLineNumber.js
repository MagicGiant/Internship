const Logger = require("../../logger");

class AddLineNumber{

  constructor(logger){
    this.lineNumber = 1; 
    this.logger = logger;
  }

  change(chunk, callback) {
    try {
      if (this.lineNumber === 1){
        return `${this.increaseLineNumber()}|${chunk}`;
      }
      
      if (chunk.includes('\n')){
        let splitChunks = chunk.split('\n');
        let result = "";
        for (let i in splitChunks){
          if (i == splitChunks.length - 1){
            result += splitChunks[i];
            break;
          }
          result += `${splitChunks[i]}\n${this.increaseLineNumber()}|`;
        }

        return result;
      }

      return chunk;
    } catch (error) {
      callback.bind(this, error)
    } finally{
      callback.bind(this)
    }
  }

  increaseLineNumber(){
    this.lineNumber++;
    this.logger.lineNumber++;
    return this.lineNumber;
  }
}

class AddLineNumberBuilder{
  create(logger){
    return new AddLineNumber(logger);
  }
}

module.exports = {
  AddLineNumber,
  AddLineNumberBuilder
}