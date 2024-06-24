"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const someRandomCat = require("some-random-cat");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const PORT = 3000;
const app = express();

const staticPath = path.resolve(__dirname, "static");

app.set("view engine", "ejs");
app.use(express.static("css"));

const createViewPath = (page) =>
  path.resolve(__dirname, "views", `${page}.ejs`);

const getJokesHtml = async () => {
  const response = await fetch("https://www.anekdot.ru/random/anekdot/");
  const text = await response.text();
  return text;
};

const getRandomCatUrl = async () => {
  try {
    const res = await someRandomCat.Random.getCat();
    return res.url;
  } catch (e) {
    return error(e);
  }
};
const renderPath = async (res, fileDirPath) => {
  fs.stat(fileDirPath, (err, stats) => {
    if (err) {
      return res.status(404).send("File or directory not found");
    }

    if (stats.isFile()) {
      res.sendFile(fileDirPath);
    } else {
      fs.readdir(fileDirPath, (err, files) => {
        if (err) {
          console.error("Error reading static directory", err);
          return res.status(500).send("Server error");
        } else res.render(createViewPath("index"), { files });
      });
    }
  });
};

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
});

app.get("/", (req, res) => {
  renderPath(res, staticPath);
});

app.get("/jokes", async (req, res) => {
  const jokesCount = 5;
  const jokesHtml = await getJokesHtml();
  const dom = await new JSDOM(jokesHtml);
  const document = dom.window.document;

  const allItems = document.querySelectorAll(".text");

  const jokes = Array.from(allItems).slice(0, jokesCount);

  res.render(createViewPath("jokes"), { jokes });
});

app.get("/cat", async (req, res) => {
  const catUrl = await getRandomCatUrl();
  // const catUrl = 'https://cdn2.thecatapi.com/images/5lr.jpg'
  res.render(createViewPath("cat"), { catUrl });
});

app.get("/regForm", (req, res) =>{
  res.render(createViewPath("singIn"))
})

app.get("/logForm", (req, res) => {
  res.render(createViewPath("logIn"))
})

app.post('/check-user', (req, res) => {
    console.log(req.body);
})

app.get("/*", (req, res) => {
  const fileDirPath = path.join(staticPath, req.params[0]);

  renderPath(res, fileDirPath);
});

app.use((req, res) => {
  let redirectPath = "/";
  console.log(`Invalid link. Redirect to "${redirectPath}"`);
  res.redirect(redirectPath);
});
