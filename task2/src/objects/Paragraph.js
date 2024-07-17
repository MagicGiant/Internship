class Paragraph{
  textRegex = /<p.*?>(?<text>.*?)<\/p>/s;
  classRegex = /<p.*?class="(?<class>.*?)".*?>/s
  pidRegex = /<p.*?data-pid="(?<pid>.*?)".*?>/s
  
  firstPid = null;
  lastPid = null;

  get(str){
    let paragraphs = {
      type: "p",
      source: str
    }

    paragraphs.text = this.textRegex.exec(str)?.groups?.text
      .replace(/(<.*?>)|(\n)|(\t)/gs, '');
    paragraphs.class = this.classRegex.exec(str)?.groups?.class;
    paragraphs.pid = this.pidRegex.exec(str)?.groups?.pid;

    this.processPid(paragraphs.pid);

    return paragraphs;
  }

  processPid(pid){
    if (pid == undefined || pid == null){
      return;
    }

    if (this.firstPid == null){
      this.firstPid = pid;
      this.lastPid = pid;
    }
    else{
      this.lastPid = pid;
    }
  }
}

module.exports = Paragraph;