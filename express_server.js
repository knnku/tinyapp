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

tinyApp.listen(PORT, () => {
  console.log(`The server is listening on port: ${PORT}`);
});
