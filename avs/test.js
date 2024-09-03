const path = require('path');
const fs = require('fs');
const elementKdocAdapter = require('./element-kdoc-adapter/kdoc-adapter');
const kdocAdapter = require('./kdoc-adapter/kdoc-adapter');

function getResults(html){

  let start = performance.now();
  let cheerioObj = kdocAdapter(html);

  let cheerioResult = {
    time: performance.now() - start,
    obj: cheerioObj
  } 

  start = performance.now();
  let elementObj = elementKdocAdapter(html);

  let elementsResult = {
    time: performance.now() - start,
    obj: elementObj
  }

  return {cheerioResult, elementsResult}
}

function testKdocAdapter(filesNames = []){
  let filesPaths = filesNames.map(name => {
    return path.join(__dirname, `./docs/htmls/${name}.html`)
  })

  for (let path of filesPaths){
    let html = fs.readFileSync(path).toString();

    let results = getResults(html);

    test(`checkTime_cherioGreater_${path}`, () =>{
      expect(results.cheerioResult.time).toBeGreaterThan(results.elementsResult.time);
      console.log(`${path}:\n\tВремя cheerio: ${results.cheerioResult.time},\n\tВремя elements: ${results.elementsResult.time}`);
    })

    test(`checkEqual_true_${path}`, () =>{
      expect(JSON.stringify(results.cheerioResult.obj)).toBe(JSON.stringify(results.elementsResult.obj))
    })
  }
}

// Названия файлов
testKdocAdapter(['9056051', '351102147'])
