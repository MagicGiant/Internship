const { log } = require('console');
const fs = require('fs');
const path = require('path');

class Logger{
  
  /**
   * @param { string } path
   */
  constructor(path){
    this.path = path;
  }

  /**
   * @param {string} data
   * @returns {void}
   */
  addLog(data){
    fs.appendFileSync(this.path, `${data}\n`);
  }

   /**
    * @returns {void}
    */
  clearLogs(){
    fs.writeFileSync(this.path, '');
  }
}

module.exports = Logger;