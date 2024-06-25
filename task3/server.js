"use strict";

const express = require("express");
const User = require("./models/user");
const pathCreator = require("./js/pathCreator");
const joke = require("./js/joke");
const staticPath = require("./js/static");
const cat = require("./js/cat");
const Checker = require("./js/checker")
const MessageRedirect = require("./js/messageRedirect");
const {UserTransaction} = require("./transactions/user.transaction");
const { password } = require("pg/lib/defaults");

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
  if (! Checker.isLogIn){
    res.send(MessageRedirect.doesNotLogInMessage("/"));
    return;
  };

  const jokes = await joke.getJokes(5);
  res.render(pathCreator.createViewPath("jokes"), { jokes });
});

app.get("/cat", async (req, res) => {
  if (! Checker.isLogIn){
    res.send(MessageRedirect.doesNotLogInMessage("/"));
    return;
  };
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

  if (req.body.password != req.body.secpassword){
    res.send(MessageRedirect.passwordsMismatch("/sing-up"));
    return;
  }

  const user = new User(await UserTransaction.getLastId() + 1, req.body.username, req.body.password);

  if (await Checker.checkingForUserAlreadyExistence(user)){
    res.send(MessageRedirect.userAlreadyExistenceMessage("/sing-up"));
    return;
  }

  UserTransaction.addUser(user);

  res.redirect('/');
})

app.post('/log-in', async(req, res) =>{
  const {username, password} = req.body;
  const user = await UserTransaction.getUserByName(username);

  if (!user || password != user.password){
    res.send(MessageRedirect.passwordOrLoginIncorrect("/log-in"));
    return;
  }

  Checker.isLogIn = true;

  res.redirect('/')
})

app.get("/*", (req, res) => {
  if (! Checker.isLogIn){
    res.send(MessageRedirect.doesNotLogInMessage("/"));
    return;
  };
  const fileDirPath = pathCreator.path.join(pathCreator.staticPath, req.params[0]);

  staticPath.renderPath(res, fileDirPath);
});

app.use((req, res) => {
  let redirectPath = "/";
  console.log(`Invalid link. Redirect to "${redirectPath}"`);
  res.redirect(redirectPath);
});