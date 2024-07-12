const Paragraph = require("./Paragraph");

class Td{
  tdRegex = /<td.*?(class="(?<class>.*?)")?.*?>(?<value>.*?)<\/td>/gis;

  paragraphRegex = /<p.*?>.*?<\/p>/gis;

  firstPid=null;
  lastPid=null;

  get(str){
    let td = {
      type: "td",
      paragraphs: []
    }

    let paragraph = new Paragraph();

    let tdMatch;
    while ((tdMatch = this.tdRegex.exec(str)) != null) {
      td.style = tdMatch.groups.class;

      String(tdMatch.groups.value).match(this.paragraphRegex).forEach(element => {
        td.paragraphs.push(paragraph.get(String(element)));
      }); 
    }

    this.firstPid = paragraph.firstPid;
    this.lastPid = paragraph.lastPid;

    return td;
  }
}

module.exports = Td;