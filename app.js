//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://127.0.0.1:27017/userSecret", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser
    .save()
    .then(function (newUser) {
      console.log("User saved");
      res.render("secrets");
    })
    .catch(function (err) {
      console.log("Error saving");
    });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({ email: username, password: password })
    .then(function (foundUser) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          res.render("login");
        }
      } else {
        res.render("login");
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.put("/", function (req, res) {});

app.delete("/", function (req, res) {});

app.listen(49382, function () {
  console.log("server started on port 3000");
});
