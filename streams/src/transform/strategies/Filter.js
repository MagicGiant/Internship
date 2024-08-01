class Filter{
  constructor(config){
    this.config = config;
  }

  change(chunk, callback) {
    try {
      let resultChunk = chunk;
      for (let i = 0; i < this.config.filterKeywords.length; i++) {
        let regexKeyword = _escapeRegExp(this.config.filterKeywords[i]);
        var regexp = new RegExp(String.raw`${regexKeyword}`, "gi");
        resultChunk = resultChunk.replace(regexp, "");
      }
      return resultChunk
    } catch (error) {
      callback(error)
    } finally{
      callback()
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

  create(){
    return new Filter(this.config);
  }
}

module.exports ={
  Filter,
  FilterBuilder
} 