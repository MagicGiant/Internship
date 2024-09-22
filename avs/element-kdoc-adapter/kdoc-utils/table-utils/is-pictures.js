const Elements = require("../../parser/elements");

/**
 *@param {Elements} rows
 *@returns {boolean}
 */
module.exports = (rows) => {
  let isPictures = true;

  rows.each((row) => {
    new Elements(row.html).parse('td').each((tdElement) =>{
      new Elements(tdElement.html).parse('p').each((row) =>{
        const text = row.getText();

        if (!text) return;

        if (!text.match(/^<picture[^>]+?><img[^>]+?><\/ picture>$/)) {
          isPictures = false;
        }
      })
    })
  });

  return isPictures;
};
