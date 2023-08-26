const express = require("express");
const morgan = require("morgan");
const tinyUrlApp = express();
const cookieParser = require("cookie-parser");
const PORT = 8080;

//Generate random number and convert (some of the) chars into a string using base36 to serve as url ID
function generateRandomString() {
  return Math.random().toString(36).substring(3, 9);
}

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  m21nx8: {
    id: "m21nx8",
    email: "someguy@nerd.com",
    password: "iamnoone",
  },
  x8c9fp: {
    id: "x8c9fp",
    email: "fourofspades@cards.com",
    password: "bingo",
  },
};

const findUserByEmail = (email) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
};

const addUser = (userID, userInput) => {
  users[userID] = {
    id: userID,
    email: userInput.email,
    password: userInput.password,
  };
}

tinyUrlApp.set("view engine", "ejs");
tinyUrlApp.use(morgan("dev"));
tinyUrlApp.use(cookieParser());
tinyUrlApp.use(express.urlencoded({ extended: true }));

//------- EXPRESS-HTTP methods here from then on ------>

//Register - Render
tinyUrlApp.get("/register", (req, res) => {
  const userCookieID = req.cookies["user_id"];
  const templateVars = {
    user_id: users[userCookieID],
  };
  res.render("urls_register", templateVars);
});

//Register - Post
tinyUrlApp.post("/register", (req, res) => {
  const userID = generateRandomString();
  const userInput = req.body;
  // const existEmailCheck = Object.values(users);  -display userdb email values to compare with input

  if (!userInput.password || !userInput.email) {
    return res.status(400).send("Email and password can't be blank!");
  }

  // const user = findUserByEmail(email);
  // if (existEmailCheck.includes(email)) {
  //   res
  //     .status(400)
  //     .send("Entered email existing. Please enter another email.");
  // }


  addUser(userID, userInput);

  console.log(users); //User DB check
  res.cookie("user_id", userID);
  res.redirect("/urls");
});

//Logout - delete cookie
tinyUrlApp.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// //OLD LOGIN
// tinyUrlApp.post("/login", (req, res) => {
//   // console.log(req.body); test-stuff
//   if (req.body.username.length === 0) {
//     return res.status(400).send("Username cannot be blank!");
//   }
//   res.cookie("username", req.body.username);
//   res.redirect("/urls");
// });

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

// Redirect to long URL via urls_show
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
  const userCookieID = req.cookies["user_id"];
  const templateVars = {
    user_id: users[userCookieID],
  };

  res.render("urls_new", templateVars);
});

//Redirect to new URL after submitting
tinyUrlApp.get("/urls/:id", (req, res) => {
  const userCookieID = req.cookies["user_id"];
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user_id: users[userCookieID],
  };
  res.render("urls_show", templateVars);
});

//URL Homepage
tinyUrlApp.get("/urls", function (req, res) {
  const userCookieID = req.cookies["user_id"];
  const templateVars = {
    urls: urlDatabase,
    user_id: users[userCookieID],
  };

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
