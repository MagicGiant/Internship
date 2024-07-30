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


module.exports ={
  ToUpperCase,
}