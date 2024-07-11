const fs = require("fs");
const filePath = "examples/doc.html";

class Properties {
  #propertyRegex = /(?<prop>.+?):(?<value>.+?);/gis;

  get(str){
    let properties = {};

    let propertyMatch;
    while ((propertyMatch = this.#propertyRegex.exec(str)) != null) {
      properties[`${propertyMatch.groups.prop}`] = propertyMatch.groups.value;
    }

    return properties;
  }
}

class Styles {
  #groupRegex = /(?<=<style>).+?(?=<\/style>)/gis;
  #styleRegex = /(\n)*(?<style>.+?)\{(?<value>.+?)\}/gis;

  get(str) {
    let styles = {};

    const groupStr = str.match(this.#groupRegex)[0];

    let styleMatch;
    while ((styleMatch = this.#styleRegex.exec(groupStr)) != null) {
      let styleName = styleMatch.groups?.style;
      let styleValue = styleMatch.groups?.value;
      let styleProperties = new Properties().get(styleValue);

      styles[`${styleName}`] = styleProperties;
    }

    return styles;
  }
}

let styles = new Styles();

fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  }

  let styles = new Styles();
  console.log(styles.get(data));
});
