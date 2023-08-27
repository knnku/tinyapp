const PORT = 8080;

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "m21nx8",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "m21nx8",
  },
  px7u8p: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "x8c9fp",
  },
};

const users = {
  m21nx8: {
    id: "m21nx8",
    email: "someguy@nerd.com",
    password: "$2a$10$ByHCJmBYlwAAMSXni2MIBOrNhJ7r/a9SoeC83ZbRmR9McxF.TYgaW",
  },
  x8c9fp: {
    id: "x8c9fp",
    email: "fourofspades@cards.com",
    password: "$2a$10$OGT6nJm9EaZwEdIUcvNJte923rW.tttN6wX.W3Ba3h8uLGV43jCMu",
  },
};

module.exports = {
  PORT,
  urlDatabase,
  users,
}


