const fs = require('fs');
const elementKdocAdapter = require('./element-kdoc-adapter/kdoc-adapter');
const kdocAdapter = require('./kdoc-adapter/kdoc-adapter');
const path = require('path');

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

async function main(){
    console.log(await getTimes('564068267.html'));
    console.log(await getTimes('9056051.html'));
    console.log(await getTimes('902111644.html'))
}

main()