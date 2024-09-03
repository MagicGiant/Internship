const Elements = require("../../parser/elements");

/**
 * Проверяет, является ли таблица двойной рамкой.
 *
 * Функция принимает коллекцию рядов таблицы, объект cheerio для работы с DOM и объект со стилями,
 * и возвращает boolean значение, указывающее на то, является ли таблица двойной рамкой.
 *
 * @param {Elements} rows коллекция рядов таблицы.
 * @param {object} stylesData объект со стилями.
 * @returns {boolean} Результат проверки: true, если таблица является двойной рамкой, иначе false.
 */
module.exports = (rows, stylesData) => {
  let isDoubleFrame = true;
  const rowCount = rows.length;
  const colCount = new Elements(rows.elements[0].html).parse('td').length;

  const border = {
    left: [],
    right: [],
    top: [],
    bottom: [],
  };
  
  for (let i = 0; i < rowCount - 2; i++) {
    border.left[i] = false;
    border.right[i] = false;
  }
  
  for (let j = 0; j < colCount - 2; j++) {
    border.top[j] = false;
    border.bottom[j] = false;
  }
  
  rows.each((rowElement, rowIndex) =>{
    new Elements(rowElement.html).parse('td').each((cellElement, cellIndex) =>{
      if (!isDoubleFrame) return 'break';

      const styleClass = stylesData[cellElement.attr('class')];

      const left = /solid/.test(styleClass["border-left"]);
      const right = /solid/.test(styleClass["border-right"]);
      const top = /solid/.test(styleClass["border-top"]);
      const bottom = /solid/.test(styleClass["border-bottom"]);

      const isTopRow = rowIndex == 0;
      const isBottomRow = rowIndex == rowCount - 1;
      const isFirstCol = cellIndex == 0;
      const isLastCol = cellIndex == colCount - 1;

      const isSecondRow = rowIndex == 1;
      const isPreLastRow = rowIndex == rowCount - 2;
      const isSecondCol = cellIndex == 1;
      const isPreLastCol = cellIndex == colCount - 2;

// TODO: Отрефакторить↴ 😬

      if (isTopRow) {
        if (isFirstCol) {
          if (left && !right && top && !bottom) return "break";
        } else if (isLastCol) {
          if (!left && right && top && !bottom) return "break";
        } else {
          if (!left && !right && top) {
            if (bottom) border.top[cellIndex - 1] = true;
            return "break";
          }
        }
      } else if (isBottomRow) {
        if (isFirstCol) {
          if (left && !right && !top && bottom) return "break";
        } else if (isLastCol) {
          if (!left && right && !top && bottom) return "break";
        } else {
          if (!left && !right && bottom) {
            if (top) border.bottom[cellIndex - 1] = true;
            return "break";
          }
        }
      } else if (isSecondRow) {
        if (isFirstCol) {
          if (left && !top && !bottom) {
            if (right) border.left[rowIndex - 1] = true;
            return "break";
          }
        } else if (isLastCol) {
          if (right && !top && !bottom) {
            if (left) border.right[rowIndex - 1] = true;
            return "break";
          }
        } else if (isSecondCol) {
          if (rowCount == 3) {
            if (colCount == 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (left) border.left[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              return "break";
            } else if (colCount > 3) {
              if (left) border.left[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              if (!right) return "break";
            }
          } else if (rowCount > 3) {
            if (colCount == 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (left) border.left[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (!bottom) return "break";
            } else if (colCount > 3) {
              if (left) border.left[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (!bottom && !right) return "break";
            }
          }
        } else if (isPreLastCol) {
          if (rowCount == 3) {
            if (colCount == 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (left) border.left[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              return "break";
            } else if (colCount > 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              if (!left) return "break";
            }
          } else if (rowCount > 3) {
            if (colCount == 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (left) border.left[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (!bottom) return "break";
            } else if (colCount > 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              if (!bottom && !left) return "break";
            }
          }
        }
      } else if (isPreLastRow) {
        if (isFirstCol) {
          if (left && !top && !bottom) {
            if (right) border.right[rowIndex - 1] = true;
            return "break";
          }
        } else if (isLastCol) {
          if (right && !top && !bottom) {
            if (left) border.left[rowIndex - 1] = true;
            return "break";
          }
        } else if (isSecondCol) {
          if (rowCount == 3) {
            if (colCount == 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (left) border.left[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              return "break";
            } else if (colCount > 3) {
              if (left) border.left[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              if (!right) return "break";
            }
          } else if (rowCount > 3) {
            if (colCount == 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (left) border.left[rowIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              if (!top) return "break";
            } else if (colCount > 3) {
              if (!top && !right) return "break";
            }
          }
        } else if (isPreLastCol) {
          if (rowCount == 3) {
            if (colCount == 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (left) border.left[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              return "break";
            } else if (colCount > 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (top) border.top[cellIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              if (!left) return "break";
            }
          } else if (rowCount > 3) {
            if (colCount == 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (left) border.left[rowIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              if (!top) return "break";
            } else if (colCount > 3) {
              if (right) border.right[rowIndex - 1] = true;
              if (bottom) border.bottom[cellIndex - 1] = true;
              if (!top && !left) return "break";
            }
          }
        }
      }

      isDoubleFrame = false;

    })
  })

  let fullBorder = true;

  for (let i = 0; i < rowCount - 2; i++) {
    if (!border.left[i]) {
      fullBorder = false;
      break;
    }
    if (!border.right[i]) {
      fullBorder = false;
      break;
    }
  }

  for (let j = 0; j < colCount - 2; j++) {
    if (!border.top[j]) {
      fullBorder = false;
      break;
    }
    if (!border.bottom[j]) {
      fullBorder = false;
      break;
    }
  }

  return isDoubleFrame && fullBorder;
};
