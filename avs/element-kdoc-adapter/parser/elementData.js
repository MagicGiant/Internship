class ElementData {
  /**
   * @type {string}
   * @description весь html элемента, который может меняться при вызове таких методов как replace, replaceTag
   * */
  all = "";
  /**@type {string}*/ parameters = "";
  /**@type {string}*/ tag = "";
  /**@type {string}*/ body = "";
}

module.exports = ElementData;
