class AddLineNumber{

  constructor(){
    this.lineNumber = 1; 
  }

  change(chunk, callback) {
    try {
      if (this.lineNumber === 1){
        return `${this.lineNumber++}|${chunk}`;
      }
      
      if (chunk.includes('\n')){
        let splitChunks = chunk.split('\n');
        let result = "";
        for (let substr of splitChunks){
          result += `${substr}\n${this.lineNumber++}|`;
        }

        return result;
      }

      return chunk;
    } catch (error) {
      callback(error)
    } finally{
      callback()
    }
  }
}

class AddLineNumberBuilder{
  create(){
    return new AddLineNumber();
  }
}

module.exports = {
  AddLineNumber,
  AddLineNumberBuilder
}