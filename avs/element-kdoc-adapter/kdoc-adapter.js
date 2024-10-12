const getParagraph = require("./kdoc-utils/text-utils/get-paragraph");
const getStyles = require("./kdoc-utils/get-styles");
const getTables = require("./kdoc-utils/get-tables");
const Elements = require("./parser/elements");
/**
 * Конвертирует html-строку в объект особо вида для дальнейшей обработки.
 *
 * Функция принимает html-строку и возвращает объект с данными о содержимом документа
 * и css-стилях содержимого
 *
 * @param {string} html исходная html-строка
 * @returns {Promise<object>} Результат: объект с информацией о содержимом документа и о css-стилях
 */
module.exports = async (html) => {
  // читаем стили
  const stylesData = getStyles(html);

  const paragraphs = new Elements(html).parse("p");
  const tables = new Elements(html).parse("table");

  
  const objects = [];
  paragraphs.each(element => {
    const PObject = getParagraph(element, stylesData);
    objects.push(PObject);
  });
  

  const tablesArray = getTables(tables, stylesData);

  const resultArray = [];


  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const table = tablesArray.find((table) => table.firstPid == object.pid);

    if (table) {
      if (!table.firstPid || !table.lastPid) continue;

      if (table.type == "TABLE") {
        resultArray.push(table);
      } else if (table.type == "ROWS") {
        table.rows.forEach((row) => {
          resultArray.push(row);
        });
      } else if (table.type == "OBJECTS") {
        table.objects.forEach((object) => {
          resultArray.push(object);
        });
      }

      const firstIdx = table.cells.indexOf(
        table.cells.find((cell) => cell.pid == table.firstPid)
      );

      i += table.cells.length - 1 - firstIdx;
    } else {
      resultArray.push(object);
    }
  }

  return { objects: resultArray, styles: stylesData };
};
