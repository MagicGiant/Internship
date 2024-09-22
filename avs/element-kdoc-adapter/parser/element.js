const ElementData = require("./elementData");

/**
 * @description Нужен для работы с единственным тегом. Находит в html только первый элемент. Можно получить атрибуты элемента, все данные elementData, удалить из элемента часть текста или целый тег.
 * @todo Пока находит атрибуты очень топорно. Должно быть полное совпадение строки атрибута. (class="hello") не будет равен (class = " hello "). Поэтому все parameters[] вводить с учетом этого
 * @example let element = new Element(html).parse('p'); element.replaceElement('span', ['class="style"'], '');
 */
class Element {
  /**@type {string}*/ html;
  /**@type {ElementData}*/ elementData = null;

  /**
   *@param {string} html
   */
  constructor(html) {
    this.html = html.replace(/\u00A0/g, "&nbsp;");
  }

  /**
   * @param { string } str
   * @param { RegExp } regex
   */
  static getCoordinateRegex(str, regex) {
    const matches = [...str.matchAll(regex)];

    return matches.map((match) => ({
      start: match.index,
      end: match.index + match[0].length,
    }));
  }

  /**
   *@description Безопасный метод распарсить множество тегов
   *@param { string } html
   *@param { string } tag
   *@param { ElementData[] } parameters
   *@returns { ElementData[] }
   */
  static getElementsData(html, tag, parameters = []) {
    // Здесь используется алгоритм скобочной последовательности, за счет чего учитывается вложенность тегов

    let parametersRegex = Element.getParametersRegex(parameters);

    let openTagParamRegex = new RegExp(
      `<${tag}${parametersRegex}[^><]*?>`,
      "g"
    );
    let openTag = new RegExp(`<${tag}.*?>`, "g");
    let closeTagRegex = new RegExp(`<\/${tag}.*?>`, "g");

    // Open tag with parameters coordinates: координаты открытых тегов с атрибутами
    let OTPCs = Element.getCoordinateRegex(html, openTagParamRegex);
    // Open tag coordinates: координаты всех открытых тегов
    let OTCs = Element.getCoordinateRegex(html, openTag);
    // Close tag coordinates: координаты всех закрытых тегов
    let CTCs = Element.getCoordinateRegex(html, closeTagRegex);

    // Тут хранятся координаты итоговых подстрок-тегов
    let resultCoord = [];

    OTPCs.forEach((OTPC) => {
      if (
        resultCoord.length != 0 &&
        OTPC.start < resultCoord[resultCoord.length - 1].end
      ) {
        return;
      }

      OTCs = OTCs.filter((OTC) => OTC.start > OTPC.start);
      CTCs = CTCs.filter((CTC) => CTC.start > OTPC.start);

      let newResult = {};
      // dif - разница между количеством открытых тегов и закрытых
      let dif = 1;
      while (dif != 0) {
        if (OTCs.length === 0 || OTCs[0].start > CTCs[0].start) {
          dif--;
          newResult.start = OTPC.start;

          newResult.end = CTCs[0].end;
          CTCs.shift();
        } else if (OTCs[0].start < CTCs[0].start) {
          dif++;
          OTCs.shift();
        }
      }

      resultCoord.push(newResult);
    });

    let result = resultCoord.map((el) => {
      let strElement = html.slice(el.start, el.end);
      let tagRegex = Element.getTagRegex(tag, parameters);
      return Element.createElementDataFromMatch(tagRegex.exec(strElement));
    });

    return result;
  }

  /**
   *@param {RegExpExecArray} match
   *@returns {ElementData}
   */
  static createElementDataFromMatch(match) {
    let elementData = Object.assign(new ElementData(), match.groups);
    elementData.parameters = elementData.parameters.trim().split(" ");
    return elementData;
  }

  /**
   *@param {string[]} parameters
   */
  static getParametersRegex(parameters = []) {
    return parameters
      .map((param) => {
        return `[^><]*?${param}`;
      })
      .join("");
  }

  /**
   *@param {string} tag
   *@param {string[]} parameters
   *@returns {RegExp}
   *@description возвращает регулярное выражение для парса единственного элемента (используется жадный квантификатор для тела тега)
   */
  static getTagRegex(tag, parameters = []) {
    let parametersRegex = Element.getParametersRegex(parameters);

    return new RegExp(
      `(?<all><(?<tag>${tag})(?<parameters>${parametersRegex}[^><]*?)>(?<body>.*)</${tag}>)`,
      "gis"
    );
  }

  /**
   * @param {boolean} [trim=true]
   * @returns {string|null} Вернет null если elementData = null (не был вызван метод parse)
   * @description Возвращает elementData.body без тегов, оставляя только текст без крайних пробелов
   */
  getText(trim = true) {
    if (!this.elementData) {
      return null;
    }

    let a = this.elementData.body
      .replace(/<[^>]+>/gs, "")
      .replace(/&nbsp;/g, "\u00A0")
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&amp;/g, "&")

    if (trim) {
      a = a.trim();
    }
    return a;
  }

  /**
   * @param { ElementData } elementData
   * @param { string[] } parameters
   * @returns { boolean }
   * @deprecated Текущий функционал позволяет обойтись без этого метода
   */
  isAllParameters(elementData, parameters) {
    const quoteReplaceRegex = /['`]/g;
    const thisParam_replace = elementData.parameters.map((str) =>
      str.replace(quoteReplaceRegex, '"')
    );
    const inputParam_replace = parameters.map((str) =>
      str.replace(quoteReplaceRegex, '"')
    );

    return inputParam_replace.every((param) =>
      thisParam_replace.includes(param)
    );
  }

  /**
   *@param {string} tag
   *@param {string[]} parameters
   *@returns {Element}
   */
  parse(tag, parameters = []) {
    const tagRegex = Element.getTagRegex(tag, parameters);
    let match = tagRegex.exec(this.html);

    if (!match) {
      return this;
    }

    this.elementData = Element.createElementDataFromMatch(match);

    return this;
  }

  /**
   * @param {string} name
   * @returns {string[]|null}
   * @description находит все атрибуты. Учитываются как те, что прописаны через пробел так и те, что дублируются
   * @example attr("class"); parameters = ["class('aba caba')", "class('str')"] => return [aba, caba, str]
   */
  attrs(name) {
    if (!this.elementData) {
      return null;
    }

    let paramRegex = new RegExp(`${name}="(?<attrs>.*?)"`);

    let result = [];

    this.elementData.parameters.forEach((val) => {
      let match = paramRegex.exec(val);
      if (match) {
        result.push(...Object.assign({}, match.groups).attrs.split(" "));
      }
    });

    return result;
  }

  /**
   * @param {string} name
   * @returns {string|null}
   * @description находит первый атрибут
   */
  attr(name) {
    let attrs = this.attrs(name);
    if (!attrs) {
      return null;
    }

    return attrs[0];
  }

  /**
   *@param {string|RegExp} searchValue
   *@param {string} replaceValue
   *@description удаляет часть текста элемента. Важно понимать, что this.html не изменится. Только this.elementData с его полями. Это позволяет хранить изначальный html из которого был создан элемент и то, как он изменился
   *@returns {Element}
   */
  replace(searchValue, replaceValue) {
    if (!this.elementData) {
      return null;
    }

    this.elementData.all = this.elementData.all.replace(
      searchValue,
      replaceValue
    );
    Object.assign(
      this.elementData,
      Element.createElementDataFromMatch(
        Element.getTagRegex(this.elementData.tag).exec(this.elementData.all)
      )
    );
    return this;
  }

  /**
   *@param {string} tag
   *@param {string[]} parameters
   *@param {string} replaceValue
   *@returns {Element}
   */
  replaceElement(tag, parameters, replaceValue) {
    if (!this.elementData) {
      return this;
    }

    let elementsData = Element.getElementsData(this.html, tag, parameters);

    elementsData.forEach((element) => {
      this.replace(element.all, replaceValue);
    });

    // let regex = Element.getTagRegex(tag, parameters);
    // let match = regex.exec(this.elementData.all);

    // while (match){

    //   let elementData = Element.createElementDataFromMatch(match);

    //   if (this.isAllParameters(elementData, parameters)){
    //     this.replace(elementData.all, replaceValue);
    //   }

    //   match = regex.exec(this.elementData.all);
    // }
    return this;
  }
}

module.exports = Element;
