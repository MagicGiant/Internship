class Filter{
  constructor(config){
    this.config = config;
  }

  change(chunk, callback) {
    try {
      let resultChunk = chunk;
      for (let i = 0; i < this.config.filterKeywords.length; i++) {
        var regexp = new RegExp(String.raw`\s?${this.config.filterKeywords}\s?`, "gi");;
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

module.exports = Filter;