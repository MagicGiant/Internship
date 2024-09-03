const Element = require("./element");

/**
 * @description Класс-контейнер. Парсит всю html страницу и хранит ее в виде объектов Element. Можно итерироваться по элементам с помощью метода each.
 * @example let elements = new Elements(htmlStr).parse('p'); elements.each(el => console.log(el));
 */
class Elements {
  /**
   * @param { string } html
   */
  constructor(html) {
    this.html = html.replace(/\u00A0/g, "&nbsp;");
    /**@type {Element[]}*/ this.elements = [];
  }

  get length() {
    return this.elements.length;
  }

  /**
   *@param {string} tag
   *@param {string[]} parameters
   *@returns {Elements}
   */
  parse(tag, parameters = []) {
    this.elements = [];

    let elementsData = Element.getElementsData(this.html, tag, parameters);

    elementsData.forEach((elementData) => {
      let element = new Element(elementData.all);
      element.elementData = elementData;
      this.elements.push(element);
    });

    return this;
  }

  /**
   * @param {function(Element, number): void} f
   * @returns {Elements}
   * @description Итерироваться по элементам. Обратный вызов принимает значение и индекс
   */
  each(f) {
    let size = this.elements.length;
    let it = 0;
    while (size > it) {
      let command = f(this.elements[it], it);
      if (command) {
        if (command == "break") {
          break;
        } else if (command == "continue") {
          continue;
        }
      }
      it++;
    }

    return this;
  }
}

module.exports = Elements;
