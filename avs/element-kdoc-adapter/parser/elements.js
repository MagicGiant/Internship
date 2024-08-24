const Element = require("./element");

class Elements {

	/**
	 * @param { string } html
	 */
	constructor(html) {
		this.html = html;
		/**@type {Element[]}*/ this.elements = [];
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
	 * @param {function(Element): void} f 
	 * @returns {Elements}
	 * @description Итерироваться по элементам. Обратный вызов принимает индекс и значение
	 */
	each(f) {
		let size = this.elements.length;
    let it = 0;
		while(size > it){
			let command = f(this.elements[it]);
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
