const Elements = require("../../parser/elements");
const getParagraph = require("../text-utils/get-paragraph");

module.exports = (tableObject, tableText, stylesData) => {
  tableObject.type = "OBJECTS";
  tableObject.objects = [];

  const paragraphs = new Elements(tableText).parse('p');

  paragraphs.each(element => {
    const PObject = getParagraph(element, stylesData);

    tableObject.objects.push(PObject);
  });
};
