class Elements {

	/**
	 * @param { string } html
	 */
	constructor(html) {
		this.html = html;
		/**@type {string[]}*/
		this.elements = [];
		this.length = 0;
	}

  /**
   *@param {string} tag 
   *@returns {RegExp}
   */
  getTagRegex(tag){
    return new RegExp(`(?<all><(?<tag>${tag})(?<parameters>.*?)>(?<body>.*?)</${tag}>)`, "gis");
  }

  /**
   *@param {RegExpExecArray} match 
   *@returns {object}
   */
  createElement(match){
    let element = Object.assign({}, match.groups);
    // console.log(element.parameters.trim().split(' '));
    element.parameters = element.parameters.trim().split(' ');

    
    return element;
  }

	/**
	 *@param {string} tag
	 *@param {string[]} parameters
	 *@returns {Elements}
	 */
	parse(tag, parameters = []) {
    this.elements = [];
		const tagRegex = this.getTagRegex(tag);

		let match = tagRegex.exec(this.html);
		
		while(match){
      let element = this.createElement(match);
      
      if (parameters.every(arrEl => element.parameters.includes(arrEl))){ 
		    this.elements.push(element);
      }

      match = tagRegex.exec(this.html);
		}

		return this;
	}

  /**
   *@param {string} name 
   *@returns {string[]|undefined}
   *@description находит все атрибуты. Учитываются как те, что прописаны через пробел так и те, что дублируются
   *@example attr("class"); parameters = ["class('aba caba')", "class('str')"] => return [aba, caba, str]
   */
  attr(name){
    let paramRegex = new RegExp(`${name}="(?<attrs>.*?)"`);

    let result = [];

    this.each((it, el) => {
      /**@type {string[]}*/ let parameters = el.parameters;
      parameters.forEach((val) => {
        let match = paramRegex.exec(val);
        if (match){
          result.push(...Object.assign({}, match.groups).attrs.split(' '));
        }
      })
    })

    return result;
  }

	/**
	 * @param {function(number, object, replaceElement): void} f 
	 * @returns {Elements}
	 * @description Итерироваться по элементам. Обратный вызов принимает индекс и значение
	 */
	each(f) {
    replaceElement.elementParser = this;

		let size = this.elements.length;
		let it = 0;

		while(size > it){
      replaceElement.it = it;
			f(it, this.elements[it], replaceElement)
			it++
		}

    return this;
	}
}

/**
 *@param {string} newElement 
 *@returns {void}
 *@description Безопасно заменяет элемент, учитывая все параметры. Используется только для @see Elements#each
 */
function replaceElement(newElement){
  /**@type {Elements}*/ let parser =  replaceElement.elementParser;
  /**@type {number}*/ let it = replaceElement.it;

  parser.elements[it] = parser
    .createElement(parser
      .getTagRegex(parser
        .elements[it]
        .tag)
      .exec(newElement));
}

module.exports = Elements;
