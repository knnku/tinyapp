const express = require("express");
const tinyApp = express();
const PORT = 8080;

function generateRandomString() {
  return Math.random().toString(36).substring(3,9);
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

tinyApp.set("view engine", "ejs");
tinyApp.use(express.urlencoded({ extended: true }));

tinyApp.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

tinyApp.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

tinyApp.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

tinyApp.get("/urls", function (req, res) {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

tinyApp.get("/", function (req, res) {
  res.send("Hello!");
});

tinyApp.get("/urls.json", function (req, res) {
  res.json(urlDatabase);
});

tinyApp.get("/hello", function (req, res) {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

tinyApp.listen(PORT, () => {
  console.log(`The server is listening on port: ${PORT}`);
  console.log(generateRandomString());
});
