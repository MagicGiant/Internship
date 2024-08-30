const Elements = require("../../parser/elements");
const getParagraph = require("../text-utils/get-paragraph");

module.exports = (tableObject, tableText, stylesData) => {
  tableObject.type = "OBJECTS";
  tableObject.objects = [];

  const paragraphs = new Elements(tableText).parse("p");

  paragraphs.each(element => {
    const PObject = getParagraph(element, stylesData);

    const text = PObject.text
      .trim()
      .replace(/<picture[^>]+?><img[^>]+?><\/picture>/g, "");

    if (
      !text.match(/[a-z]{2,}|[A-Z][a-z]|[A-Z]{2,}/) ||
      !text.match(/^[A-Za-z,.;()"'/\\*[\]{}\-_\d\s]+$/)
    ) {
      tableObject.objects.push(PObject);
    }
  });
};
