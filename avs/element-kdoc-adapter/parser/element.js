const ElementData = require('./elementData');

/**
 * @description Нужен для работы с единственным тегом. Находит в html только первый элемент. Можно получить атрибуты элемента, все данные elementData, удалить из элемента часть текста или целый тег.
 * @example let element = new Element(html).parse('p'); element.replaceElement('span', ['class="style"'], '');
 */
class Element{
	/**@type {string}*/ html;
	/**@type {ElementData}*/ elementData = null;
		
	/**
	 *@param {string} html
	 */
	constructor(html){
		this.html = html
	}

	/**
	 *@param {RegExpExecArray} match 
	 *@returns {ElementData}
	 */
	static createElementData(match){
		let elementData = Object.assign(new ElementData(), match.groups);
		elementData.parameters = elementData.parameters.trim().split(' ');
		return elementData;
	}

	/**
	 *@param {string} tag 
	 *@returns {RegExp}
	 */
	static getTagRegex(tag){
		return new RegExp(`(?<all><(?<tag>${tag})(?<parameters>.*?)>(?<body>.*?)</${tag}>)`, "gis");
	}

  
  /**
   * @returns {string|null} Вернет null если elementData = null (не был вызван метод parse)
   * @description Возвращает elementData.body без тегов, оставляя только текст без крайних пробелов
   */
  getText(){
    if (!this.elementData){
      return null;
    }
    let a = this.elementData.body.replace(/<[^>]+>/gs, '').trim();
    // console.log(a);
    
    return a;
  }

 /**
  * @param { ElementData } elementData
  * @param { string[] } parameters
  * @returns { boolean }
  */
	isAllParameters(elementData, parameters){

    const quoteReplaceRegex = /['`]/g;

    const thisParam_replace = elementData.parameters.map(str => str.replace(quoteReplaceRegex, '"'));

    const inputParam_replace = parameters.map(str => str.replace(quoteReplaceRegex, '"'));

		return inputParam_replace.every(param =>thisParam_replace.includes(param));
	}

	/**
	 *@param {string} tag
	 *@param {string[]} parameters
	 *@returns {Element}
	 */
	parse(tag, parameters = []) {
		const tagRegex = Element.getTagRegex(tag);
		let match = tagRegex.exec(this.html);
		
		if (!match){
			return this;
		}

		let elementData = Element.createElementData(match);
		
		if (this.isAllParameters(elementData, parameters)){ 
			this.elementData = elementData;
		}

		return this;
	}

	/**
		* @param {string} name 
		* @returns {string[]|null}
		* @description находит все атрибуты. Учитываются как те, что прописаны через пробел так и те, что дублируются
		* @example attr("class"); parameters = ["class('aba caba')", "class('str')"] => return [aba, caba, str]
		*/
	attrs(name){
		if(!this.elementData){
			return null;
		}

		let paramRegex = new RegExp(`${name}="(?<attrs>.*?)"`);

		let result = [];

		this.elementData.parameters.forEach((val) => {
			let match = paramRegex.exec(val);
			if (match){
				result.push(...Object.assign({}, match.groups).attrs.split(' '));
			}
		})

		return result;
	}

	/**
	 * @param {string} name 
	 * @returns {string|null}
	 * @description находит первый атрибут
	 */
	attr(name){
		let attrs = this.attrs(name);
		if (!attrs){
			return null
		}

		return attrs[0];
	}

	/**
	 *@param {string|RegExp} searchValue
	 *@param {string} replaceValue
	 *@description удаляет часть текста элемента. Важно понимать, что this.html не изменится. Только this.elementData с его полями. Это позволяет хранить изначальный html из которого был создан элемент и то, как он изменился
	 *@returns {Element}
	 */
	replace(searchValue, replaceValue){
		if (!this.elementData){
			return null;
		}

		this.elementData.all = this.elementData.all.replace(searchValue, replaceValue);
		Object.assign(this.elementData, Element.createElementData(Element.getTagRegex(this.elementData.tag).exec(this.elementData.all)))
		return this;
	}

	/**
	 *@param {string} tag 
	 *@param {string[]} parameters
	 *@param {string} replaceValue
	 *@returns {Element}
	 */
	replaceElement(tag, parameters, replaceValue){
    let match = Element.getTagRegex(tag).exec(this.elementData.all)

    if (!match){
      return this;
    }
    
		let elementData = Element.createElementData(match);

		if (this.isAllParameters(elementData, parameters)){
			this.replace(elementData.all, replaceValue);
		}

		return this;
	}
}

module.exports = Element;