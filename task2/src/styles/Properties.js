class Properties {
  propertyRegex = /(?<prop>.+?):(?<value>.+?);/gis;

  get(str){
    let properties = {};

    let propertyMatch;
    while ((propertyMatch = this.propertyRegex.exec(str)) != null) {
      properties[`${propertyMatch.groups.prop}`] = propertyMatch.groups.value;
    }

    return properties;
  }
}

module.exports = Properties;