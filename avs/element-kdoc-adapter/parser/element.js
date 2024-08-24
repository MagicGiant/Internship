const ElementData = require('./elementData');

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
   *@returns {Element}
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
    
    if (parameters.every(arrEl => elementData.parameters.includes(arrEl))){ 
      this.elementData = elementData;
    }

		return this;
  }

   /**
    *@param {string} name 
    *@returns {string[]|null}
    *@description находит все атрибуты. Учитываются как те, что прописаны через пробел так и те, что дублируются
    *@example attr("class"); parameters = ["class('aba caba')", "class('str')"] => return [aba, caba, str]
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
   *@param {string} name 
   *@returns {string|null}
   *@description находит первый атрибут
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
}

module.exports = Element;