const fs = require('fs');
const path = require('path');

class Logger{
  loggerPath = path.join(__dirname, 'logs.txt');

  addLog(data){
    fs.appendFileSync(this.loggerPath, `${data}\n`);
  }

  clearLogs(){
    fs.writeFileSync(this.loggerPath, '');
  }
}

module.exports = Logger;