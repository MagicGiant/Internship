const { log } = require('console');
const cheerio = require("cheerio");
// const kdoc = require('./kdoc-adapter/kdoc-adapter');
const Logger = require('./element-kdoc-adapter/logger');
const fs = require('fs');
const Elements = require('./element-kdoc-adapter/parser/elements');
const getStyles = require('./kdoc-adapter/kdoc-utils/get-styles');
const getParagraph = require('./element-kdoc-adapter/kdoc-utils/text-utils/get-paragraph');
const getParagraphCheerio = require('./kdoc-adapter/kdoc-utils/text-utils/get-paragraph')

let logger = new Logger('./logs.html'); 
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

async function main(){
  let html = fs.readFileSync('./docs/htmls/1200072087.html').toString();

  // console.log(await elementStrategy(html));
  const [result1, result2] = await Promise.all([elementStrategy(html), cheerioStrategy(html)]);

  console.log(result1);
  console.log(result2);
  
  
}

main()