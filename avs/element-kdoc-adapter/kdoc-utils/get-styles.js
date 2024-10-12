module.exports = (/**@type {string}*/ html) => {

  
  const regex = /\.(?<name>[a-zA-Z0-9\-_ ]+)\s*\{(?<data>[^\{\}]*?)\}/g;
  const stylesData = {};

  let match = regex.exec(html);
  while(match){
    const name = match.groups.name;
    const propsString = match.groups.data.trim();
    stylesData[name] = {};

    propsString.split(";").forEach((prop) => {
      if (prop) {
        const [propName, propValue] = prop.split(":").map(s => s.trim());
        if (propName && propValue) {
          stylesData[name][propName] = propValue;
        }
      }
    });
    match = regex.exec(html);
  }

  return stylesData;
};
