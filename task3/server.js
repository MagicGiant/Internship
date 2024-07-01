"use strict";

const express = require("express");
const User = require("./src/models/user");
const pathCreator = require("./public/js/pathCreator");
const joke = require("./public/js/joke");
const staticPath = require("./public/js/static");
const cat = require("./public/js/cat");
const Checker = require("./public/js/checker");
const MessageRedirect = require("./public/js/messageRedirect");
const hasher = require('./public/js/hasher');
const { UserRepository } = require("./src/repositories/user.repository");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const PORT = 3000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "asdjsdaqjwhegfbjbdjsayeglrjhbqwyf",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await UserRepository.getUserByName(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!await hasher.checkPassword(password, user.password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      Checker.isLogIn = true;
      return done(null, user);
    } catch (err) {
      if (err) {
        return done(err);
      }
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await UserRepository.getUserById(id);
    done(null, user);
  } catch(err) {
    done(err, null);
  }
});

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
});

app.get("/jokes", async (req, res) => {
  if (!Checker.isLogIn) {
    res.send(MessageRedirect.doesNotLogInMessage("/"));
    return;
  }

  const jokes = await joke.getJokes(5);
  res.render(pathCreator.createViewPath("jokes"), { jokes });
});

app.get("/cat", async (req, res) => {
  if (!Checker.isLogIn) {
    res.send(MessageRedirect.doesNotLogInMessage("/"));
    return;
  }
  const catUrl = await cat.getRandomCatUrl();
  res.render(pathCreator.createViewPath("cat"), { catUrl });
});



app.get("/log-in", (req, res) => {
  res.render(pathCreator.createViewPath("logIn"));
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: false,
  })
);

app.get("/sing-up", (req, res) => {
  res.render(pathCreator.createViewPath("singUp"));
});

app.post("/sing-up", async (req, res) => {
  if (req.body.password != req.body.secpassword) {
    res.send(MessageRedirect.passwordsMismatch("/sing-up"));
    return;
  }

  const user = new User(
    (await UserRepository.getLastId()) + 1,
    req.body.username,
    await hasher.hashPassword(req.body.password)
  );

  if (await Checker.checkingForUserAlreadyExistence(user)) {
    res.send(MessageRedirect.userAlreadyExistenceMessage("/sing-up"));
    return;
  }

  UserRepository.addUser(user);

  res.redirect("/");
});

app.post("/log-out", (req, res) =>{
  Checker.isLogIn = false;
  res.redirect("/");
});

app.get("/", (req, res) => {
  staticPath.renderPath(res, pathCreator.staticPath, Checker.isLogIn);
});

app.get("/*", (req, res) => {
  if (!Checker.isLogIn) {
    res.send(MessageRedirect.doesNotLogInMessage("/"));
    return;
  }
  const fileDirPath = pathCreator.path.join(
    pathCreator.staticPath,
    req.params[0]
  );

  staticPath.renderPath(res, fileDirPath, Checker.isLogIn);
});

app.use((req, res) => {
  let redirectPath = "/";
  console.log(`Invalid link. Redirect to "${redirectPath}"`);
  res.redirect(redirectPath);
});
