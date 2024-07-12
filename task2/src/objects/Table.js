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

    let td = new Td();

    let tableMatch = this.tableRegex.exec(str);

    String(tableMatch[0]).match(this.tdRegex).forEach(element => {
      table.cells.push(td.get(String(element)));
    });

    table.firstPid = td.firstPid;
    table.lastPid = td.lastPid;

    return table;
  }
}

module.exports = Table;