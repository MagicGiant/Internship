const fs = require('fs');
const path = require('path');

class Logger{
  loggerPath = path.join(__dirname, 'logs.txt');

  filterNumber = 0;

  lineNumber = 0;

  addLog(data){
    fs.appendFileSync(this.loggerPath, `${data}\n`);
  }

  getResultStr(){
    return `Количество строк: ${this.lineNumber}\n`+
      `Количество отфильтрованных строк ${this.filterNumber}`;
  }

  clearLogs(){
    fs.writeFileSync(this.loggerPath, '');
  }
}

module.exports = Logger;