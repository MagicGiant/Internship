"use strict";

const express = require("express");
const User = require("./models/user");
const UserTransactions = require("./transactions/user.transaction")
const pathCreator = require("./js/pathCreator");
const joke = require("./js/joke");
const staticPath = require("./js/static");
const cat = require("./js/cat");

const PORT = 3000;
const app = express();


app.set("view engine", "ejs");
app.use(express.static("css"));
app.use(express.urlencoded({extended: false })) 


app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
});

app.get("/", (req, res) => {
  staticPath.renderPath(res, pathCreator.staticPath);
});

app.get("/jokes", async (req, res) => {
  const jokes = await joke.getJokes(5);
  res.render(pathCreator.createViewPath("jokes"), { jokes });
});

app.get("/cat", async (req, res) => {
  const catUrl = await cat.getRandomCatUrl();
  res.render(pathCreator.createViewPath("cat"), { catUrl });
});

app.get("/sing-up", (req, res) =>{
  res.render(pathCreator.createViewPath("singUp"))
})

app.get("/log-in", (req, res) => {
  res.render(pathCreator.createViewPath("logIn"))
})

app.post('/sing-up', async (req, res) => {
  const user = new User(await UserTransactions.getLastId() + 1, req.body.username, req.body.password);

  UserTransactions.addUser(user);

  res.redirect('/');
})

app.get("/*", (req, res) => {
  const fileDirPath = pathCreator.path.join(pathCreator.staticPath, req.params[0]);

  staticPath.renderPath(res, fileDirPath);
});

app.use((req, res) => {
  let redirectPath = "/";
  console.log(`Invalid link. Redirect to "${redirectPath}"`);
  res.redirect(redirectPath);
});