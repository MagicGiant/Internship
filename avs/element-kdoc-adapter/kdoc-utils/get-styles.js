const TimeSeeker = require("../utils/time-seeker");

module.exports = (/**@type {string}*/ html) => {

  let allStart = performance.now();
  
  const regex = /\.(?<name>[a-zA-Z0-9\-_ ]+)\s*\{(?<data>[^\{\}]*?)\}/g;

  const stylesIterator = html.matchAll(/\.([^{]+)\s*?\{([^}]*?)\}/g);


  const stylesData = {};

  let cycleStart = performance.now();
  let match = regex.exec(html);
  while(match){
    let trimMatchStart = performance.now();
    const name = match.groups.name;
    const propsString = match.groups.data.trim();
    stylesData[name] = {};
    TimeSeeker.stylesTime.trimMatch += performance.now() - trimMatchStart;

    let foreachStart = performance.now();
    propsString.split(";").forEach((prop) => {
      if (prop) {
        const [propName, propValue] = prop.split(":").map(s => s.trim());
        if (propName && propValue) {
          stylesData[name][propName] = propValue;
        }
      }
    });
    TimeSeeker.stylesTime.foreach.time += performance.now() - foreachStart;
    match = regex.exec(html);
  }

  TimeSeeker.stylesTime.cycle.time += performance.now() - cycleStart;
  TimeSeeker.stylesTime.all.time += performance.now() - allStart;

  return stylesData;
};
