const fetch = require("node-fetch");
const {JSDOM} = require("jsdom");

const jokesUrl = "https://www.anekdot.ru/random/anekdot/";

const getJokesHtml = async (jokesUrl) => {
  const response = await fetch(jokesUrl);
  const text = await response.text();
  return text;
};

const getJokes = async (maxJokesCount) => {
  const jokesHtml = await getJokesHtml(jokesUrl);
  const dom = await new JSDOM(jokesHtml);
  const document = dom.window.document;

  const allItems = document.querySelectorAll(".text");

  const jokes = Array.from(allItems).slice(0, maxJokesCount);

  return jokes;
}

module.exports ={
  jokesUrl,
  getJokesHtml,
  getJokes,
}