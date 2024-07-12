const Paragraph = require("./Paragraph");
const Td = require("./td");

class Table{
  tableRegex = /<table.*?(class="(?<class>.*?)")?.*?>.*?<\/table>/gis;
  
  tdRegex = /<td.*?>.*?<\/td>/gis;

  get(str){
    let table = {
      type: "table",
      cells: []
    }

    let tableMatch = this.tableRegex.exec(str);

    String(tableMatch[0]).match(this.tdRegex).forEach(element => {
      table.cells.push(new Td().get(String(element)));
    });

    return table;
  }
}

module.exports = Table;