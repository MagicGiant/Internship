const path = require('path');
const fs = require('fs');
const elementKdocAdapter = require('./element-kdoc-adapter/kdoc-adapter');
const kdocAdapter = require('./kdoc-adapter/kdoc-adapter');

const testResultsDir = path.join(__dirname, 'testResults');

function getFileNamesWithoutExtension(dirPath) {
  const files = fs.readdirSync(dirPath);
  const fileNamesWithoutExtension = files.map(file => {
    const fileName = path.parse(file).name;
    return fileName;
  });
  return fileNamesWithoutExtension;
}

let allFilesNames =  getFileNamesWithoutExtension(path.join(__dirname, './docs/htmls'));
// 573219755
// 456069588
// let allFilesNames = ['566409068']

testKdocAdapter(allFilesNames);

// Очистка папки "testResults"
function rmResults() {
  if (fs.existsSync(testResultsDir)) {
    fs.rmSync(testResultsDir, { recursive: true, force: true });
  }
}

async function getResults(html) {
  let start = performance.now();
  let cheerioObj = await kdocAdapter(html);

  let cheerioResult = {
    time: performance.now() - start,
    obj: cheerioObj,
  };

  start = performance.now();
  let elementObj = await elementKdocAdapter(html);

  let elementsResult = {
    time: performance.now() - start,
    obj: elementObj,
  };

  return { cheerioResult, elementsResult };
}

function saveResults(results, fileName) {
  const fileDir = path.join(testResultsDir, fileName);
  fs.mkdirSync(fileDir, { recursive: true });

  fs.writeFileSync(path.join(fileDir, 'cheerioResult.json'), JSON.stringify(results.cheerioResult.obj, null, 0));
  fs.writeFileSync(path.join(fileDir, 'elementsResult.json'), JSON.stringify(results.elementsResult.obj, null, 0));
}

function compareWithoutSource(results){
  let replaceRegex = new RegExp('"source":".*?"(?=,")', 'g')
  return JSON.stringify(results.cheerioResult.obj).replace(replaceRegex,'') == 
    JSON.stringify(results.elementsResult.obj).replace(replaceRegex, '')
}

async function testKdocAdapter(filesNames = []) {
  rmResults();

  await Promise.all(
    filesNames.map(async (name) => {
      let htmlPath = path.join(__dirname, `./docs/htmls/${name}.html`);
      let html = fs.readFileSync(htmlPath).toString();

      let stats = fs.statSync(htmlPath);
      let fileSizeInBytes = stats.size;

      describe(`Testing file ${name}`, () => {
        let results;

        beforeAll(async () => {
          results = await getResults(html);
          saveResults(results, name);
        });

        test(`checkTime_cherioGreater_${name}`, () => {
          expect(results.cheerioResult.time).toBeGreaterThan(results.elementsResult.time);
          console.log(`${name}:\n\tВремя cheerio: ${results.cheerioResult.time},`);
          console.log(`\tВремя elements: ${results.elementsResult.time}`);
          console.log(`\tРазмер файла: ${fileSizeInBytes} байт`);
        });

        test(`checkEqual_true_${name}`, () => {
          expect(compareWithoutSource(results)).toBe(true);
        });
      });
    })
  );
}

