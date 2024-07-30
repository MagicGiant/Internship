class Filter{
  constructor(config){
    this.config = config;
  }

  change(chunk) {
    let resultChunk = chunk;
    for (let i = 0; i < this.config.filterKeywords.length; i++) {
      var regexp = new RegExp(String.raw`\s?${this.config.filterKeywords}\s?`, "gi");;
      resultChunk = resultChunk.replace(regexp, "");
    }
    return resultChunk
  }
}

module.exports = Filter;