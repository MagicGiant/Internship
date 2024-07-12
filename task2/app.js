const fs = require("fs");
const filePath = "examples/doc.html";
const Styles = require("./src/styles/Styles");
const HtmlObjects = require("./src/objects/HtmlObjects");
const Parser = require("./src/parser");
const Table = require("./src/objects/Table");

let styles = new Styles();

fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  }

  let obj = new Parser();
  fs.writeFileSync('./output.json', JSON.stringify(obj.get(data), null, 2));
});
