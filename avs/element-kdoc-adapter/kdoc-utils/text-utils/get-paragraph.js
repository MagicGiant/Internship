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

  element.replace('span[style="padding-left:1em;"]', ' ');

  // $e('span[style="padding-left:1em;"]').each(function () {
  //   $(this).replaceWith(" ");
  // });
  
  const spanElement = new Element(element.html).parse('span', ['style="padding-left:5em;"']);
  // const spanElement = $('span[style="padding-left:5em;"]', $element);

  const styleAttributeValue = spanElement.attr('style');
  // const styleAttributeValue = spanElement.attr("style");


  const paddingValue = styleAttributeValue
    ? styleAttributeValue.match(/padding-left:(\d+)em;/)
    : null;
  const spacesBefore = paddingValue ? parseInt(paddingValue[1]) : 0;

  const styleClass = stylesData[element.attr("class")];
  // const styleClass = stylesData[$element.attr("class")];

  const isBold = 
    element.elementData.body.trim() ||
      isBoldFull(element.html, stylesData);

  const isItalic =
    element.elementData.body.trim() &&
    (styleClass["font-style"] == "italic" ||
      isItalicText(element.html, stylesData));

  const format = getTextFormat(styleClass, element, isBold);
  
  const PObject = {
    type: "P",
    source: element.html,
    pid: element.attr("data-pid"),
    spacesBefore: spacesBefore,
    text: element.elementData.body,
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
  }

  return PObject;
};
