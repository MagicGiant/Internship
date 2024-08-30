const Element = require("./element");

/**
 * @description Класс-контейнер. Парсит всю html страницу и хранит ее в виде объектов Element. Можно итерировать по элементам с помощью метода each.
 * @example let elements = new Elements(htmlStr).parse('p'); elements.each(el => console.log(el));
 */
class Elements {
	/**
	 * @param { string } html
	 */
	constructor(html) {
		this.html = html;
		/**@type {Element[]}*/ this.elements = [];

    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof prop === 'string' && !isNaN(prop)) {
          return target.elements[Number(prop)];
        }
        return target[prop];
      }
    });
	}

  get length(){
    return this.elements.length;
  }

	/**
	 *@param {string} tag
	 *@param {string[]} parameters
	 *@returns {Elements}
	 */
	parse(tag, parameters = []) {
    this.elements = [];
		const tagRegex = Element.getTagRegex(tag);
		let match = tagRegex.exec(this.html);
		
		while(match){
      let elementData = Element.createElementData(match);

      let element = new Element(elementData.all);
      element.elementData = elementData
      
      if (parameters.every(arrEl => elementData.parameters.includes(arrEl))){ 
		    this.elements.push(element);
      }
    
      match = tagRegex.exec(this.html);
		}

		return this;
	}

	/**
	 * @param {function(Element, number): void} f 
	 * @returns {Elements}
	 * @description Итерироваться по элементам. Обратный вызов принимает индекс и значение
	 */
	each(f) {
		let size = this.elements.length;
    let it = 0;
		while(size > it){
			let command = f(this.elements[it], it);
      if (command){
        if (command == "break"){
          break;
        }else if (command == "continue"){
          continue;
        }
      }
			it++
		}

    return this;
	}
}

module.exports = Elements;
