const Elements = require("../../parser/elements");

/**
 * Проверяет, что таблица является просто элементами в рамке.
 *
 * Функция принимает коллекцию рядов таблицы, объект cheerio для работы с DOM и объект со стилями,
 * и возвращает boolean значение, указывающее на то, что таблица является просто элементами в рамке.
 *
 * @param {Elements} rows коллекция рядов таблицы.
 * @param {object} stylesData объект со стилями.
 * @returns {boolean} Результат проверки: true, если таблица является просто элементами в рамке, иначе false.
 */
module.exports = (rows, stylesData) => {
  let isSingleFrame = true;

  const rowCount = rows.length;

  rows.each((rowElement, rowIndex) => {
    
    let tds = new Elements(rowElement.html).parse('td');
    const colCount = tds.length;
    // const colCount = $(rowElement).find("td").length;

    tds.each((cellElement, cellIndex) => {
      if (!isSingleFrame) return 'break';

      const styleClass = stylesData[cellElement.attr("class")];

      const left = /solid/.test(styleClass["border-left"]);
      const right = /solid/.test(styleClass["border-right"]);
      const top = /solid/.test(styleClass["border-top"]);
      const bottom = /solid/.test(styleClass["border-bottom"]);

      const isTopRow = rowIndex == 0;
      const isBottomRow = rowIndex == rowCount - 1;
      const isFirstCol = cellIndex == 0;
      const isLastCol = cellIndex == colCount - 1;

      if (isTopRow) {
        if (isFirstCol) {
          if (left && top && !right && !bottom) {
            return 'break';
          }

          if (isLastCol && left && top && right && !bottom) {
            return 'break';
          }
        }
        if (isLastCol) {
          if (!left && top && right && !bottom) {
            return 'break';
          }
        } else {
          if (top) return 'break';
        }
      } else if (isBottomRow) {
        if (isFirstCol) {
          if (left && !top && !right && bottom) {
            return 'break';
          }

          if (isLastCol && left && !top && right && bottom) {
            return 'break';
          }
        }
        if (isLastCol) {
          if (!left && !top && right && bottom) {
            return 'break';
          }
        } else {
          if (bottom) return 'break';
        }
      } else {
        if (isFirstCol) {
          if (left && !top && !bottom) {
            return 'break';
          }

          if (isLastCol && left && !top && right && !bottom) {
            return 'break';
          }
        } else if (isLastCol) {
          if (!top && right && !bottom) {
            return 'break';
          }
        } else if (!isTopRow && !isBottomRow && !isFirstCol && !isLastCol) {
          return 'break';
        }
      }

      isSingleFrame = false;
    });
  });

  return isSingleFrame;
};
