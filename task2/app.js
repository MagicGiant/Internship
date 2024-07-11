const fs = require("fs");
const filePath = "examples/doc.html";
const Styles = require("./src/Styles");

let styles = new Styles();

fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  }

  let styles = new Styles();
  console.log(styles.get(data));
});
