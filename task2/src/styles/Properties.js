class Properties {
  propertyRegex = /(?<prop>.+?):(?<value>.+?);/gis;

  get(str){
    let properties = {};

    let propertyMatch;
    while ((propertyMatch = this.propertyRegex.exec(str)) != null) {
      let propName = propertyMatch.groups.prop.replace(/\s+/g, '');

      properties[`${propName}`] = propertyMatch.groups.value;
    }

    return properties;
  }
}

module.exports = Properties;