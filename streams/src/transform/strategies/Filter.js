class Filter{
  constructor(config, logger){
    this.config = config;
    this.logger = logger;
  }

  static filterNumber = 0;

  change(chunk, callback) {
    try {
      let resultChunk = chunk;
      for (let i = 0; i < this.config.filterKeywords.length; i++) {
        let regexKeyword = _escapeRegExp(this.config.filterKeywords[i]);
        var regexp = new RegExp(String.raw`${regexKeyword}`, "gi");
        resultChunk = resultChunk.replace(regexp, () => {
          this.logger.filterNumber++;
          return "";
        });
      }
  
      return resultChunk;
    } catch (error) {
      callback.bind(this, error)
    } finally{
      callback.bind(this)
    }
  }
}


function _escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // экранирует все специальные символы
}

class FilterBuilder{
  constructor(config){
    this.config = config;
  }

  create(logger){
    return new Filter(this.config, logger);
  }
}

module.exports ={
  Filter,
  FilterBuilder
} 