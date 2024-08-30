const Elements = require("../../parser/elements");
const {
  isBoldFull,
  isItalicText,
  getTextFormat,
} = require("../text-utils/text-format-utils");

/**
 * Заполняет поле "rows" у табличного объекта адаптера.
 *
 * Функция принимает табличный объект из адаптера, коллекцию cheerio-объектов рядов таблицы,
 * объект cheerio для работы с DOM и объект со стилями.
 *
 * @param {object} tableObject табличный объект из адаптера.
 * @param {Elements} rows коллекция cheerio-объектов рядов таблицы.
 * @param {object} stylesData объект со стилями.
 * @returns {void}
 */
module.exports = (tableObject, rows, stylesData) => {
  tableObject.type = "ROWS";
  tableObject.rows = [];

  rows.each((_index, row) => {
    let text = "";
    const cells = [];

    let firstPid = "";
    let lastPid = "";

    new Elements(row.html).parse('td').each(tdElement => {
      new Elements(tdElement.html).parse('p').each(cell => {
        const kdocHtmlRegExp =
        /<picture\s+class="[^>]+"><img\s+src="data:image\/png;base64,[^>]+"\s+style="[^>]+"><\/picture>/;

        let cellText = "";

        if (kdocHtmlRegExp.test(cell.html.trim())) {
          cell
            .replace(/<span style="padding-left:1em;">/g, (str) => ` ${str}`)
            .replace(/<(?!\/?(picture|img)\b)[^>]*>/g, "")
            .replace(/&nbsp;/g, " ");
        }

        if (!cellText) cellText = cell.getText();

        text += cellText;

        const styleClass = stylesData[cell.attr('class')];
        const isBold = cell.getText() &&
          (styleClass['font-weight'] == 'bold' ||
            isBoldFull(cell.html, stylesData));
        const isItalic =
          cell.getText() &&
          (styleClass['font-style'] == 'italic' ||
            isItalicText(cell.html, stylesData));
        
        const format = getTextFormat(styleClass, cell, isBold);

        const cellObject = {
          type: 'P',
          source: cell.html,
          pid: cell.attr('data-pid'),
          spacesBefore: 0,
          text: cellText,
          format: format,
          align: styleClass ? styleClass['text-align'] : undefined,
          isBold,
          isItalic
        }

        if (!firstPid && cellObject.pid) firstPid = cellObject.pid;
        if (cellObject.pid) lastPid = cellObject.pid;

        cells.push(cellObject);
      })
    })

    tableObject.rows.push({
      type: 'ROW',
      source: row.html,
      text,
      cells,
      firstPid,
      lastPid
    })
  });
};
