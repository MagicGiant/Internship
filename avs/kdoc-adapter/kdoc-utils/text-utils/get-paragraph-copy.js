const {
  isBoldFull,
  isBoldStart,
  isItalicText,
  getTextFormat,
} = require("./text-format-utils");
const Elements = require("../parser/Elements");

const docType = require("../../constants").DOC_TYPE;

/**
 * Создаёт объект-параграф.
 *
 * Функция принимает объект Cheerio для работы с элементами DOM, элемент Cheerio и объект со стилями,
 * и возвращает созданный объект-параграф.
 *
 * @param {Elements} elements
 * @param {object} stylesData объект со стилями.
 * @returns {object} Созданный объект-параграф.
 */
module.exports = (elements, stylesData) => {

  let spanElements = []

  elements.each((it, element, replace) => {
    new Elements(element.all)
      .parse('span', ['style="padding-left:1em;"'])
      .each((spanIt, spanElement) => {
        replace(element.all.replace(spanElement.all, ' '))
      })
  })
  
  // $e('span[style="padding-left:1em;"]').each(function () {
  //   $(this).replaceWith(" ");
  // });

  // = new Element(element).parse('span', ['style="padding-left:5em;"'])

  // const spanElement = $('span[style="padding-left:5em;"]', $element);

  // const styleAttributeValue = spanElement.attr('style');
  const styleAttributeValue = spanElement.attr("style")[0];

  const paddingValue = styleAttributeValue
    ? styleAttributeValue.match(/padding-left:(\d+)em;/)
    : null;
  const spacesBefore = paddingValue ? parseInt(paddingValue[1]) : 0;

  const styleClass = stylesData[$element.attr("class")];
  const isBold =
    $e.text().trim() &&
    (styleClass["font-weight"] == "bold" ||
      isBoldFull($element.toString(), stylesData));
  const isItalic =
    $e.text().trim() &&
    (styleClass["font-style"] == "italic" ||
      isItalicText($element.toString(), stylesData));
  const format = getTextFormat(styleClass, $element, isBold);

  const PObject = {
    type: "P",
    source: $element.toString(),
    pid: $element.attr("data-pid"),
    spacesBefore: spacesBefore,
    text: $e.text(),
    format: format,
    align: styleClass ? styleClass["text-align"] : undefined,
    isBold: isBold,
    isItalic: isItalic,
    isBoldBegin: isBoldStart($element.toString(), stylesData),
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
