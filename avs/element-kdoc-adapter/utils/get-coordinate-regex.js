/**
 * @param { string } str
 * @param { RegExp } regex
 */
function getCoordinateRegex(str, regex){
  const matches = [...str.matchAll(regex)];
  
  return matches.map(match => ({
    start: match.index,
    end: match.index + match[0].length
  }));
}

module.exports = getCoordinateRegex;