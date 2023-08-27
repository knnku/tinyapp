//-------- Depenedencies -------->
const express = require("express");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const tinyUrlApp = express();
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

//-------- Data -------->
const data = require("./data");
const PORT = data.PORT;
const users = data.users;
const urlDatabase = data.urlDatabase;

//-------- Helper Functions -------->
const helpers = require("./helpers");
const generateRandomString = helpers.generateRandomString;
const findUserByEmail = helpers.findUserByEmail;
const findUrlByID = helpers.findUrlByID;
const addUser = helpers.addUser;
const addURL = helpers.addURL;
const urlChk = helpers.urlChk;
const urlsForUser = helpers.urlsForUser;
const urlToUsrChk = helpers.urlToUsrChk;

//------- Middle Ware -------------->
tinyUrlApp.set("view engine", "ejs");
tinyUrlApp.use(morgan("dev"));
tinyUrlApp.use(cookieParser());
tinyUrlApp.use(express.urlencoded({ extended: true }));
tinyUrlApp.use(
  cookieSession({
    name: "session",
    keys: ["fiveeightseven"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

//------- HTTP methods from here then on ------>

//Login - Render
tinyUrlApp.get("/login", (req, res) => {
  //Have to include or header partial won't render
  const userCookieID = req.session.user_id;
  //even though the page doesn't need it

  const templateVars = {
    user_id: users[userCookieID],
  };
  if (userCookieID) {
    return res.redirect("/urls");
  }
  res.render("urls_login", templateVars);
});

//Login - Post
tinyUrlApp.post("/login", (req, res) => {
  const userInput = req.body;
  const user = findUserByEmail(userInput.email, users);

  if (!userInput.password || !userInput.email) {
    return res.status(400).send("Email and password can't be blank!");
  }

  if (!user) {
    return res.status(403).send("User does not exist!");
  }

  const pwCheck = bcrypt.compareSync(userInput.password, user.password);
  if (!pwCheck) {
    return res.status(403).send("Email and/or password does not match!");
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
});

//Register - Render
tinyUrlApp.get("/register", (req, res) => {
  const userCookieID = req.session.user_id;
  const templateVars = {
    user_id: users[userCookieID],
  };

  if (userCookieID) {
    return res.redirect("/urls");
  }

  res.render("urls_register", templateVars);
});

//Register - Post
tinyUrlApp.post("/register", (req, res) => {
  const userID = generateRandomString();
  const userInput = req.body;

  if (!userInput.password || !userInput.email) {
    return res.status(400).send("Email and password can't be blank!");
  }

  const user = findUserByEmail(userInput.email, users);

  if (user) {
    return res.status(403).send("User already exists.");
  }

  addUser(userID, userInput, users);

  req.session.user_id = userID;
  res.redirect("/urls");
});

//Logout - Post
tinyUrlApp.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//Edit URL - Post
tinyUrlApp.post("/urls/:id/edit", (req, res) => {
  const userCookieID = req.session.user_id;
  const id = req.params.id;
  const longURL = req.body.longURL;

  if (!userCookieID) {
    return res.status(401).send("You need to be logged in to modify urls!");
  }

  if (!urlToUsrChk(id, userCookieID, urlDatabase)) {
    return res
      .status(401)
      .send("You are not authorized to make any changes to this url.");
  }

  if (!urlDatabase[id]) {
    return res.status(401).send("Url does not exist.");
  }

  urlDatabase[id].longURL = `http://www.${longURL}`;
  res.redirect(`/urls`);
});

//Delete URL - Post
tinyUrlApp.post("/urls/:id/delete", (req, res) => {
  const userCookieID = req.session.user_id;
  const id = req.params.id;

  if (!userCookieID) {
    return res.status(401).send("You need to be logged in to modify urls!");
  }

  if (!urlToUsrChk(id, userCookieID, urlDatabase)) {
    return res
      .status(401)
      .send("You are not authorized to make any changes to this url.");
  }

  if (!urlDatabase[id]) {
    return res.status(401).send("Url does not exist.");
  }

  delete urlDatabase[id];
  res.redirect("/urls");
});

// Redirect to long URL via urls_show
tinyUrlApp.get("/u/:id", (req, res) => {
  const id = req.params.id;

  if (!findUrlByID(id, urlDatabase)) {
    return res.status(400).send("Url does not exist in the database.");
  }

  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

//New URL form - Render
tinyUrlApp.get("/urls/new", (req, res) => {
  const userCookieID = req.session.user_id;

  if (!userCookieID) {
    return res.redirect("/login");
  }

  const templateVars = {
    user_id: users[userCookieID],
  };
  res.render("urls_new", templateVars);
});

//Redirect to new URL after submitting
tinyUrlApp.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const userCookieID = req.session.user_id;

  if (!urlChk(id, urlDatabase)) {
    return res.status(400).send("The url does not exist.");
  }

  if (!userCookieID) {
    return res.status(401).send("You need to be logged in to modify urls!");
  }

  if (!urlToUsrChk(id, userCookieID, urlDatabase)) {
    return res
      .status(401)
      .send("You are not authorized to make any changes to this url.");
  }

  const longURL = urlDatabase[id].longURL;
  const templateVars = {
    id: id,
    longURL: longURL,
    user_id: users[userCookieID],
  };

  res.render("urls_show", templateVars);
});

//New URL - Post
tinyUrlApp.post("/urls", (req, res) => {
  const userCookieID = req.session.user_id;
  let tinyUrl = generateRandomString();
  let longUrl = req.body.longURL;

  if (!userCookieID) {
    return res.status(401).send("You need to be logged in to modify urls!");
  }

  //Url assembly - add to object.
  addURL(tinyUrl, longUrl, userCookieID, urlDatabase);

  res.redirect(`/urls/${tinyUrl}`);
});

//App Homepage
tinyUrlApp.get("/urls", function (req, res) {
  const userCookieID = req.session.user_id;
  const userUrlDisplay = urlsForUser(userCookieID, urlDatabase);

  const templateVars = {
    urls: userUrlDisplay,
    user_id: users[userCookieID],
  };
  
  //Redirects if no user is logged in via cookies
  if (!userCookieID) {
    return res.redirect("/login");
  }

  res.render("urls_index", templateVars);
});

//Server index - not sure why this has been implemented lol
tinyUrlApp.get("/", function (req, res) {
  res.send("Hello!");
});

tinyUrlApp.get("/hello", function (req, res) {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//View data in JSON
tinyUrlApp.get("/urls.json", function (req, res) {
  res.json(urlDatabase);
});
tinyUrlApp.get("/users.json", function (req, res) {
  res.json(users);
});

tinyUrlApp.listen(PORT, () => {
  console.log(`The server is listening on port: ${PORT}`);
});
