const express = require("express");
const tinyUrlApp = express();
const PORT = 8080;

//Generate random number and convert (some of the) chars into a string using base36 to serve as url ID
function generateRandomString() {
  return Math.random().toString(36).substring(3, 9);
}

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

tinyUrlApp.set("view engine", "ejs");
tinyUrlApp.use(express.urlencoded({ extended: true }));

//------- EXPRESS-HTTP methods here from then on ------>

//Edit URL
tinyUrlApp.post("/urls/:id/edit", (req, res) => {
  let longUrl = req.body.longURL;
  urlDatabase[req.params.id] = `http://www.${longUrl}`;

  res.redirect(`/urls`);
});

//Delete URL
tinyUrlApp.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// Redirect to long URL -no action implemented
tinyUrlApp.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

//Create new URL POST
tinyUrlApp.post("/urls", (req, res) => {
  // console.log(req.body); // Log the POST request body to the console
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
  let tinyUrl = generateRandomString();
  let longUrl = req.body.longURL;
  urlDatabase[tinyUrl] = `http://www.${longUrl}`;

  res.redirect(`/urls/${tinyUrl}`);
});

//Create new URL form render
tinyUrlApp.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Redirect to new URL after submitting
tinyUrlApp.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

//URL Homepage
tinyUrlApp.get("/urls", function (req, res) {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//Server index - not sure why this has been implemented lol
tinyUrlApp.get("/", function (req, res) {
  res.send("Hello!");
});

//View URL database object
tinyUrlApp.get("/urls.json", function (req, res) {
  res.json(urlDatabase);
});

tinyUrlApp.get("/hello", function (req, res) {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

tinyUrlApp.listen(PORT, () => {
  console.log(`The server is listening on port: ${PORT}`);
});
