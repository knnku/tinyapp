const bcrypt = require("bcryptjs");
const data = require('./data');
const users = data.users;
const urlDatabase = data.urlDatabase;

//Generate random number and convert (some of the) chars
//into a string using base36 to serve as url ID
const generateRandomString = () => {
  return Math.random().toString(36).substring(3, 9);
};

const findUserByEmail = (email, db) => {
  for (const userId in db) {
    if (db[userId].email === email) {
      return db[userId];
    }
  }
};

const findUrlByID = (shortUrl) => {
  for (const url in urlDatabase) {
    if (url === shortUrl) {
      return url;
    }
  }
};

const addUser = (userID, userInput) => {
  const hashedPW = bcrypt.hashSync(userInput.password, 10);
  users[userID] = {
    id: userID,
    email: userInput.email,
    password: hashedPW,
  };
};

const addURL = (tinyURL, longURL, userID) => {
  urlDatabase[tinyURL] = {
    longURL: `http://www.${longURL}`,
    userID: userID,
  };
};

const urlChk = (id) => {
  const urlKeys = Object.keys(urlDatabase)
  if (urlKeys.includes(id)) {
    return true;
  }
  return false;
};

const urlsForUser = (id) => {
  let userURLS = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURLS[url] = urlDatabase[url];
    }
  }
  return userURLS;
};

const urlToUsrChk = (urlID, cookieUserID) => {
  let url = urlDatabase[urlID];
  if (url.userID !== cookieUserID) {
    return false;
  }
  return true;
};


module.exports = {
  generateRandomString,
  findUserByEmail, 
  findUrlByID, 
  urlChk,
  addUser,
  addURL,
  urlsForUser,
  urlToUsrChk
}