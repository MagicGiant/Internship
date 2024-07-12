const HtmlObjects = require("./objects/HtmlObjects");
const Styles = require("./styles/Styles");

class Parser{
  get(str){
    let styles = new Styles().get(str);
    let objects = new HtmlObjects().get(str);

    return {
      styles,
      objects
    }
  }
}

module.exports = Parser;