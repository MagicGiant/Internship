
/**
 *@template T
 *@param {T} object
 *@returns {T}
 */
function deepCopy(object) {
  if (Array.isArray(object)) {
    return object.map(item => deepCopy(item));
  }
  
  if (object && typeof object === 'object') {
    const copiedObject = {};
    
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        copiedObject[key] = deepCopy(object[key]);
      }
    }
    
    return copiedObject;
  }
  
  return object;
}

module.exports = deepCopy;