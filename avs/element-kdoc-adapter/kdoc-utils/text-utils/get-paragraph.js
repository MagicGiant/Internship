const {
  isBoldFull,
  isBoldStart,
  isItalicText,
  getTextFormat,
} = require("./text-format-utils");
const Element = require("../../parser/element");

const docType = require("../../constants").DOC_TYPE;

/**
 * Создаёт объект-параграф.
 *
 * Функция принимает объект Cheerio для работы с элементами DOM, элемент Cheerio и объект со стилями,
 * и возвращает созданный объект-параграф.
 *
 * @param {Element} element
 * @param {object} stylesData объект со стилями.
 * @returns {object} Созданный объект-параграф.
 */
module.exports = (element, stylesData) => {

  element.replaceElement('span',['style="padding-left:1em;"'], ' ');

  const spanElement = new Element(element.html).parse('span', ['style="padding-left:5em;"']);

  const styleAttributeValue = spanElement.attr('style');

  const paddingValue = styleAttributeValue
    ? styleAttributeValue.match(/padding-left:(\d+)em;/)
    : null;
  const spacesBefore = paddingValue ? parseInt(paddingValue[1]) : 0;

  const styleClass = stylesData[element.attr("class")];

  const isBold = 
    element.getText() &&
      (styleClass["font-weight"] == "bold" ||
        isBoldFull(element.html, stylesData));

  const isItalic =
    element.getText() &&
    (styleClass["font-style"] == "italic" ||
      isItalicText(element.html, stylesData));

  const format = getTextFormat(styleClass, element, isBold);
  const PObject = {
    type: "P",
    source: element.html.replace(/<\/img>/g,''),
    pid: element.attr("data-pid"),
    spacesBefore: spacesBefore,
    text: element.getText(false),
    format: format,
    align: styleClass ? styleClass["text-align"] : undefined,
    isBold: isBold,
    isItalic: isItalic,
    isBoldBegin: isBoldStart(element.html, stylesData),
    docType: docType,
  };
  
 
  

  const pictureRegExp =
    /<picture\s+class="[^>]+"><img\s+src="data:image\/png;base64,[^>]+"\s+style="[^>]+"><\/picture>/;

  if (pictureRegExp.test(PObject.source.trim())) {
    PObject.text = PObject.source
      .replace(/<span style="padding-left:1em;">/g, (str) => ` ${str}`)
      .replace(/<(?!\/?(picture|img)\b)[^>]*>/g, "")
      .replace(/&nbsp;/g, " ");
    if (PObject.text.includes('&nbsp;')){
      console.log(PObject);
      console.log('_______');
    }
  }
  return PObject;
};
