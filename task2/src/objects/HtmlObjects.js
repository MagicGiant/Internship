const Paragraph = require('./Paragraph');
const Table = require('./Table');

class HtmlObjects{
  pRegex = /<(?<type>p|table)(\s+[^>]*)?>.*?<\/\k<type>>/gis;

  get(str){
    let objects = [];

    let objectMatch;
    while ((objectMatch = this.pRegex.exec(str)) != null) {
      if (objectMatch.groups?.type == 'p'){
        objects.push(new Paragraph().get(objectMatch[0]))
      }
      else if (objectMatch.groups?.type == 'table'){
        objects.push(new Table().get(objectMatch[0]));
      }
    }

    return objects;
  }
}


module.exports = HtmlObjects;