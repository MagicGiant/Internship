class ToUpperCase{
  constructor(logger){
    this.logger = logger;
  }

  change(chunk, callback) {
    try {
      return chunk.toUpperCase();  
    } catch (error) {
      callback.bind(this, error);
    } finally{
      callback.bind(this);
    }
  }
}

class ToUpperCaseBuilder{

  create(logger){
    return new ToUpperCase(logger);
  }
}

module.exports ={
  ToUpperCase,
  ToUpperCaseBuilder
}