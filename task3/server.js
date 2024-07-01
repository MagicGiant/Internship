"use strict";

const express = require("express");
const pathCreator = require("./public/js/pathCreator");
const joke = require("./public/js/joke");
const cat = require("./public/js/cat");
const Checker = require("./public/js/checker");
const MessageRedirect = require("./public/js/messageRedirect");
const Database = require('./src/db/database');
const UserRepository = require("./src/repository/user.repository");
const app = express();

const authRouter = require('./src/routes/auth.router');
const staticRouter = require('./src/routes/static.router');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const database = Database.getDatabaseFromObject({
  user: "Sherka",
  host: "localhost",
  port: 5432,
  database: "fileManager"
});
const userRepository = new UserRepository(database);
const checker = new Checker(userRepository);

const PORT = 3000;

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
});

app.use('/auth', authRouter(userRepository, checker));

app.get("/jokes", async (req, res) => {
  if (!checker.isLogIn) {
    res.send(MessageRedirect.doesNotLogInMessage("/"));
    return;
  }

  const jokes = await joke.getJokes(5);
  res.render(pathCreator.createViewPath("jokes"), { jokes });
});

app.get("/cat", async (req, res) => {
  if (!checker.isLogIn) {
    res.send(MessageRedirect.doesNotLogInMessage("/"));
    return;
  }
  const catUrl = await cat.getRandomCatUrl();
  res.render(pathCreator.createViewPath("cat"), { catUrl });
});

app.use('/', staticRouter(checker));