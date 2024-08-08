"use strict";

const express = require("express");
const Checker = require("./src/js/checker");
const Database = require("./src/db/database");
const UserRepository = require("./src/repository/user.repository");
const app = express();

const authRouter = require("./src/routes/auth.router");
const staticRouter = require("./src/routes/static.router");
const jokesRouter = require("./src/routes/jokes.router");
const catRouter = require("./src/routes/cat.router");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const database = Database.getDatabaseFromObject({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "fileManager",
  password: "1239"
});

const userRepository = new UserRepository(database);
userRepository.createTableIfNotExists();

const checker = new Checker(userRepository);

const PORT = 3000;

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
});

app.use("/auth", authRouter(userRepository, checker));

app.use("/cat", catRouter(checker));

app.use("/jokes", jokesRouter(checker));

app.use("/", staticRouter(checker));
