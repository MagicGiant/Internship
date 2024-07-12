const Paragraph = require("./Paragraph");

class Td{
  tdRegex = /<td.*?(class="(?<class>.*?)")?.*?>(?<value>.*?)<\/td>/gis;

  paragraphRegex = /<p.*?>.*?<\/p>/gis

  get(str){
    let td = {
      type: "td",
      paragraphs: []
    }

    let tdMatch;
    while ((tdMatch = this.tdRegex.exec(str)) != null) {
      td.style = tdMatch.groups.class;

      String(tdMatch.groups.value).match(this.paragraphRegex).forEach(element => {
        td.paragraphs.push(new Paragraph().get(String(element)));
      }); 
    }

    return td;
  }
}

module.exports = Td;