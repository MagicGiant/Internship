const { Transform } = require('stream');
const Logger = require('../logger');
const { config } = require('process');
const { time } = require('console');

class TextTransform extends Transform{
  constructor(config, strategiesBuilders = []){
    super();
    this.strategiesBuilders = strategiesBuilders;

    // 
    this.strategies = []
    for (let i = 0; i < this.strategiesBuilders.length; i++) {
      this.strategies[i] = this.strategiesBuilders[i].create();
    }

    this.config = config;
    
    this.prevChunk = "";

    this.it = 1;
  }

  _transform(chunk, encoding, callback) {
    try {
      if (this.prevChunk == ""){
        this.prevChunk = chunk;
        this.push("");
        callback();
        return;
      }

      let processedMergedChunks = this.prevChunk + chunk.toString(); 
      for (let i = 0; i < this.strategies.length; i++) {
        processedMergedChunks = this.strategies[i].change(processedMergedChunks, this._strategyCallback);
      }

      let splitСhunks = this._splitStringByCharacters(processedMergedChunks, this.config.highWaterMark);

      console.log(this.it++);

      this.prevChunk = splitСhunks.rightPart;
      this.push(splitСhunks.leftPart);

      callback();
    } catch (error) {
      callback(error);
    }
  }


  _splitStringByCharacters(str, rightCharCount) {
    let totalChars = str.length;
    
    if (rightCharCount > totalChars) {
        rightCharCount = totalChars;
    }
    
    let leftCharCount = totalChars - rightCharCount;
    
    let leftPart = str.slice(0, leftCharCount);
    let rightPart = str.slice(leftCharCount);
    
    return {
        leftPart: leftPart,
        rightPart: rightPart
    };
  }

  _strategyCallback(error = null){
    if (error){
      new Logger().addLog(`strategy error: ${error.message}`);
    }
  }
}

module.exports = TextTransform;