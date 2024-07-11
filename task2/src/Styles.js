const Properties = require('./Properties')

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

module.exports = Styles