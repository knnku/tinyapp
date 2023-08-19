const express = require("express");
const tinyApp = express();
const PORT = 8080;

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

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
