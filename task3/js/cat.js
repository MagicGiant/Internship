const someRandomCat = require("some-random-cat");

const getRandomCatUrl = async () => {
  try {
    const res = await someRandomCat.Random.getCat();
    return res.url;
  } catch (e) {
    return error(e);
  }
};

module.exports = {
  getRandomCatUrl
}