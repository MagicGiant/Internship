class ToUpperCase{
  change(chunk, callback) {
    try {
      return chunk.toUpperCase();  
    } catch (error) {
      callback(error);
    } finally{
      callback();
    }
  }
}

class ToUpperCaseBuilder{
  create(){
    return new ToUpperCase();
  }
}

module.exports ={
  ToUpperCase,
  ToUpperCaseBuilder
}