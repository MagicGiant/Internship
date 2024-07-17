const fs = require("fs");
const Styles = require("./src/styles/Styles");
const HtmlObjects = require("./src/objects/HtmlObjects");
const Parser = require("./src/parser");
const Table = require("./src/objects/Table");

let styles = new Styles();

// const INPUT_FILE_PATH = "examples/Example.html";
// Это тоже работает ↴ (просто тут ⤴ будто нагляднее)
const INPUT_FILE_PATH = "examples/doc.html";

const OUT_FILE_PATH = "./output.json";

fs.readFile(INPUT_FILE_PATH, "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  }

  let obj = new Parser();
  fs.writeFileSync(OUT_FILE_PATH, JSON.stringify(obj.get(data), null, 2));
});
