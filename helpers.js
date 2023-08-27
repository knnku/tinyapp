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
  for (const user in db) {
    if (db[user].email === email) {
      return db[user];
    }
  }
  return undefined;
};

const findUrlByID = (shortUrl, db) => {
  for (const url in db) {
    if (url === shortUrl) {
      return url;
    }
  }
  return undefined;
};

const addUser = (userID, userInput, db) => {
  const password = userInput.password;
  const userEmail = userInput.email
  const hashedPW = bcrypt.hashSync(password, 10);
  return db[userID] = {
    id: userID,
    email: userEmail,
    password: hashedPW,
  };
};

const addURL = (tinyURL, longURL, userID, db) => {
  return db[tinyURL] = {
    longURL: `http://www.${longURL}`,
    userID: userID,
  };
};

const urlChk = (id, db) => {
  const urlKeys = Object.keys(db)
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