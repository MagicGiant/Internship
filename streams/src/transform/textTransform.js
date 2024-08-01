const { Transform } = require('stream');
const Logger = require('../logger');
const { config } = require('process');
const { time } = require('console');

class TextTransform extends Transform{
  constructor(config, combinedStrategiesBuilders = [], splitStrategiesBuilders = []){
    super();

    this.combinedStrategies = this._createStrategies(combinedStrategiesBuilders);
    this.splitStrategies = this._createStrategies(splitStrategiesBuilders);
    this.config = config;
    this.prevChunk = "";
  }

  _createStrategies(strategiesBuilders = []){
    let strategies = []
    for (let i = 0; i < strategiesBuilders.length; i++) {
      strategies[i] = strategiesBuilders[i].create();
    }

    return strategies;
  }

  _transform(chunk, encoding, callback) {
    try {
      if (this.prevChunk == ""){
        this.prevChunk = chunk.toString();
        this.push("");
        callback();
        return;
      }

      let combinedTransformChunk = this._combinedTransform(chunk.toString());
      let splitTransformChunk = this._splitTransform(combinedTransformChunk);

      this.push(splitTransformChunk);

      callback();
    } catch (error) {
      callback(error);
    }
  }

  _combinedTransform(chunk){
    let processedMergedChunks = this.prevChunk + chunk; 
    for (let i = 0; i < this.combinedStrategies.length; i++) {
      processedMergedChunks = this.combinedStrategies[i].change(processedMergedChunks, this._strategyCallback);
    }

    let splitСhunks = this._splitStringByCharacters(processedMergedChunks, this.config.highWaterMark);
    this.prevChunk = splitСhunks.rightPart;

    return splitСhunks.leftPart;
  }

  _splitTransform(chunk){
    let processedChunks = chunk; 
    for (let i = 0; i < this.splitStrategies.length; i++) {
      processedChunks = this.splitStrategies[i].change(processedChunks, this._strategyCallback);
    }

    return processedChunks;
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