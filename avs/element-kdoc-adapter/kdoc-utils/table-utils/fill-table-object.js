const cheerio = require("cheerio");
const isHorizontalLinesOnly = require("./is-only-horisontal");
const {
  isBoldFull,
  isItalicText,
  getTextFormat,
} = require("../text-utils/text-format-utils");
const Elements = require("../../parser/elements");
const deepCopy = require("../../utils/deep-copy");

/**
 * Заполняет табличный объект адаптера.
 *
 * Функция принимает коллекцию cheerio-объектов рядов таблицы,
 * объект cheerio для работы с DOM, объект со стилями и табличный объект из адаптера.
 *
 * @param {Elements} rows коллекция cheerio-объектов рядов таблицы.
 * @param {object} stylesData объект со стилями.
 * @param {object} tableObject табличный объект из адаптера.
 * @returns {void}
 */
module.exports = (rows, stylesData, tableObject) => {
  
  rows.each((rowElement, _rowIndex) => {

    new Elements(rowElement.html).parse('td').each((tdElement) =>{
      new Elements(tdElement.html).parse('p').each((cellElement)=>{
        const styleClass = stylesData[cellElement.attr('class')];

        const isBold = cellElement.getText() && 
        (styleClass["font-weight"] == "bold" ||
          isBoldFull(cellElement.html, stylesData));
        const isItalic =
          cellElement.getText() &&
          (styleClass["font-style"] == "italic" ||
            isItalicText(cellElement.html, stylesData));
        const format = getTextFormat(styleClass, cellElement, isBold);

        cellElement.replaceElement('span',['style="padding-left:1em;"'], ' ');
        

        const cellObject = {
          type: "P",
          source: cellElement.html.replace(/<\/img>/g,''),
          pid: cellElement.attr('data-pid'),
          spacesBefore: 0,
          text: cellElement.getText(false),
          format,
          align:  styleClass ? styleClass["text-align"] : undefined,
          isBold,
          isItalic
        }
        

        tableObject.cells.push(cellObject);

        if (cellObject.pid){
          tableObject.lastPid = cellObject.pid;
        }
      })
    })
  });

  tableObject.isDoubleLine = isHorizontalLinesOnly(rows, stylesData);

  const firstCellWithPid = tableObject.cells.find((obj) => obj.pid);
  tableObject.firstPid = firstCellWithPid ? firstCellWithPid.pid : null;
};
