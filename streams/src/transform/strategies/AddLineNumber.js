class AddLineNumber{

  constructor(){
    this.lineNumber = 1; 
  }

  change(chunk, callback) {
    try {
      // console.log(this.lineNumber);
      if (this.lineNumber === 1){
        return `${this.lineNumber++} ${chunk}`;
      }
      return chunk.replace('\n', `\n${this.lineNumber++}`);
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