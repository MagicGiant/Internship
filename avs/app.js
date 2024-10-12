const fs = require('fs');
const elementKdocAdapter = require('./element-kdoc-adapter/kdoc-adapter');
const kdocAdapter = require('./kdoc-adapter/kdoc-adapter');
const path = require('path');
const Logger = require('./element-kdoc-adapter/utils/logger');
const getStyles = require('./element-kdoc-adapter/kdoc-utils/get-styles');
const {Element} = require('./element-kdoc-adapter/parser/element');

async function getTimes(fileName){
  let html = fs.readFileSync(`./docs/htmls/${fileName}`).toString();

  let start = performance.now();
  await kdocAdapter(html);
  let cheerioResult = `cheerio adapter result: ${performance.now() - start}`

  start = performance.now();
  await elementKdocAdapter(html);
  let elementsResult = `elements result: ${performance.now() - start}`

  return [`file name: ${fileName}` , cheerioResult, elementsResult]
}

function getFilesInDirectory(directoryPath) {
  try {
      const files = fs.readdirSync(directoryPath);
      const fileNames = files.filter(file => {
          return fs.statSync(path.join(directoryPath, file)).isFile();
      });

      return fileNames;
  } catch (error) {
      console.error('Ошибка при чтении директории:', error);
      return [];
  }
}

async function logCheerioAdapter(html) {
  let logger = new Logger('./logs.json');
  logger.clearLogs();
  let result = JSON.stringify(await kdocAdapter(html), null, 2)
  logger.addLog(result);
}

async function logMyAdapter(html){
  let logger = new Logger('./myLogs.json');
  logger.clearLogs();
  let result = JSON.stringify(await elementKdocAdapter(html), null, 2);
  logger.addLog(result);
}

async function main(){

  let html = fs.readFileSync(`./docs/htmls/456069588.html`).toString();
  await logMyAdapter(html);
}

main()