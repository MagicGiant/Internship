const { log } = require('console');
const cheerio = require("cheerio");
// const kdoc = require('./kdoc-adapter/kdoc-adapter');
const Logger = require('./element-kdoc-adapter/logger');
const fs = require('fs');
const Elements = require('./element-kdoc-adapter/parser/elements');
const getStyles = require('./kdoc-adapter/kdoc-utils/get-styles');
const getParagraph = require('./element-kdoc-adapter/kdoc-utils/text-utils/get-paragraph');
const getParagraphCheerio = require('./kdoc-adapter/kdoc-utils/text-utils/get-paragraph');
const getTables = require('./kdoc-adapter/kdoc-utils/get-tables');
const getTablesElements = require('./element-kdoc-adapter/kdoc-utils/get-tables')

let logger = new Logger('./myLogs.json'); 
logger.clearLogs();

async function elementStrategy(html){
  let start = performance.now();

  const stylesData = getStyles(html);

  let elements = new Elements(html).parse('p');
  
  const objects = [];
  
  elements.each((el) => {
    
    const PObject = getParagraph(el, stylesData);
    objects.push(PObject);
  })

  return `Elements strategy: ${performance.now() - start}`;
}

async function cheerioStrategy(html){
  let start = performance.now();

  const stylesData = getStyles(html);

  const $ = cheerio.load(html);

  const paragraphs = $("p");

  const objects = [];
  paragraphs.each((_index, element) => {
    const $element = $(element);
    const PObject = getParagraphCheerio($, $element, stylesData);
    
    objects.push(PObject);
  });

  return `Cheerio strategy: ${performance.now() - start}`;
}

function cherioTableStrategy(html){
  let start = performance.now();
  const stylesData = getStyles(html);
  const $ = cheerio.load(html);
  const tables = $("table");

  getTables(tables, $, stylesData);
  
  return `Cheerio strategy for table: ${performance.now() - start}`;
}

function elementsTableStrategy(html){
  let start = performance.now();
  const stylesData = getStyles(html);
   getTablesElements(new Elements(html).parse('table'), stylesData);

  return `Elements strategy for table: ${performance.now() - start}`;
}

function findDifference(str1, str2, contextLength = 10) {
  const maxLength = Math.max(str1.length, str2.length);

  for (let i = 0; i < maxLength; i++) {
    if (str1.charCodeAt(i) !== str2.charCodeAt(i)) {
      const startIndex = Math.max(0, i - contextLength);
      const snippet1 = str1.slice(startIndex, startIndex + 2 * contextLength + 1);
      const snippet2 = str2.slice(startIndex, startIndex + 2 * contextLength + 1);
      return `Различие найдено в позиции ${i}: '${str1[i]}' != '${str2[i]}'\n
              Первая строка (${2 * contextLength + 1} символов): "${snippet1}"\n
              Вторая строка (${2 * contextLength + 1} символов): "${snippet2}"`;
    }
  }

  // if (str1.length !== str2.length) {
  //   const startIndex1 = Math.max(0, str1.length - 2 * contextLength - 1);
  //   const startIndex2 = Math.max(0, str2.length - 2 * contextLength - 1);
  //   const snippet1 = str1.slice(startIndex1);
  //   const snippet2 = str2.slice(startIndex2);
  //   return `Строки имеют разную длину: ${str1.length} и ${str2.length}\n
  //           Первая строка (${2 * contextLength + 1} символов): "${snippet1}"\n
  //           Вторая строка (${2 * contextLength + 1} символов): "${snippet2}"`;
  // }

  return "Строки полностью равны";
}


async function main(){
  let html = fs.readFileSync('./docs/htmls/1200072087.html').toString();

  // console.log(await elementStrategy(html));
  // const [result1, result2] = await Promise.all([elementStrategy(html), cheerioStrategy(html)]);

  // console.log(result1);
  // console.log(result2);

  
  const stylesData = getStyles(html);

  // console.log(elementsTableStrategy(html));
  // console.log(cherioTableStrategy(html));
  
  

  let tablesArrayElements = getTablesElements(new Elements(html).parse('table'), stylesData);

  
  // const $ = cheerio.load(html);
  // const tables = $("table");

  // let tablesArray = getTables(tables, $, stylesData);

  // console.log(findDifference(JSON.stringify(tablesArray), JSON.stringify(tablesArrayElements), 60))
  

  // console.log(JSON.stringify(tablesArray) == JSON.stringify(tables));
  
  logger.addLog(JSON.stringify(tablesArrayElements))
}

main()