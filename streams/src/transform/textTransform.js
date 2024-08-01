const { Transform } = require('stream');
const Logger = require('../logger');
const { config } = require('process');
const { time } = require('console');

class TextTransform extends Transform{
  constructor(config, logger, combinedStrategiesBuilders = [], splitStrategiesBuilders = []){
    super();

    this.logger = logger;
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

      let combinedTransformChunk = this._combinedTransform(chunk.toString(), this.combinedStrategies);
      let splitTransformChunk = this._splitTransform(combinedTransformChunk, this.splitStrategies);

      this.push(splitTransformChunk);

      callback();
    } catch (error) {
      this.logger.addLog(error);
      callback(error);
    }
  }

  _combinedTransform(chunk, strategies){
    let processedMergedChunks = this.prevChunk + chunk; 
    for (let i = 0; i < strategies.length; i++) {
      processedMergedChunks = strategies[i].change(processedMergedChunks, this._strategyCallback);
    }

    let splitСhunks = this._splitStringByCharacters(processedMergedChunks, this.config.highWaterMark);
    this.prevChunk = splitСhunks.rightPart;

    return splitСhunks.leftPart;
  }

  _splitTransform(chunk, strategies){
    let processedChunks = chunk; 
    for (let i = 0; i < strategies.length; i++) {
      processedChunks = strategies[i].change(processedChunks, this._strategyCallback);
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
      this.logger.addLog(`strategy error: ${error.message}`);
    }
  }

  _final(){
    this.push(this._splitTransform(this.prevChunk, this.combinedStrategies.concat(this.splitStrategies)));
    console.log('end');
  }
}

module.exports = TextTransform;