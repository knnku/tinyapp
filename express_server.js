const express = require("express");
const tinyApp = express();
const PORT = 8080;

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

tinyApp.set("view engine", "ejs");

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
});
