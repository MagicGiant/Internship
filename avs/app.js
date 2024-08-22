const { log } = require('console');
const kdoc = require('./kdoc-adapter/kdoc-adapter');
const Logger = require('./kdoc-adapter/kdoc-utils/logger');
const ElementParser = require('./kdoc-adapter/kdoc-utils/parser/elementParser');
const fs = require('fs')

let logger = new Logger('./logs.html'); 
logger.clearLogs();

async function main(){
  new ElementParser(fs.readFileSync('./docs/htmls/1200072087.html').toString())
  .parse('p', ['data-pid="48"'])
  .each((it, el) => {
    let element = el.all;
    new ElementParser(element)
      .parse('span', ['style="padding-left:5em;"'])
      .each((it, spanElement) =>{
        console.log(spanElement.all);
        
        element = element.replace(spanElement.all, ' ');
      })
    console.log(element);
  })
}

main()