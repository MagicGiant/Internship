const Elements = require("../../parser/elements");

/**
 *@param {Elements} rows 
 *@returns {boolean}
 */
module.exports = (rows) => {
  let isTermins = false;

  rows.each((row) => {
    let firstCellMatch = false;
    let lastCellMatch = false;
    let isFirstCell = false;

    let tds = new Elements(row.html).parse('td');

    let rowLength = tds.length;

    tds.each((cellElement, cellIndex) => {
      cellElement.replaceElement('span',['style="padding-left:1em;"'], ' ');
      
      const text = cellElement.getText();

      if (text) isFirstCell = true;

      if (
        isFirstCell &&
        text.match(/^\d+(\.\d+)*\s+[А-ЯЁа-яё\s]+?[:;][А-ЯЁа-яё\s]+?/)
      ) {
        firstCellMatch = true;
      }
      if (
        cellIndex == rowLength - 1 &&
        text.match(/[a-z]{2,}|[A-Z][a-z]|[A-Z]{2,}/) &&
        text.match(/^[A-Za-z,.;()"'/\\*[\]{}\-_\d\s]+$/)
      ) {
        lastCellMatch = true;
      }
    });

    if (lastCellMatch && firstCellMatch) isTermins = true;
  });

  return isTermins;
};
