const { assert } = require("chai");
const bcrypt = require("bcryptjs");

const helpers = require("../helpers");
const findUserByEmail = helpers.findUserByEmail;
const findUrlByID = helpers.findUrlByID;
const addUser = helpers.addUser;
const addURL = helpers.addURL;
const urlChk = helpers.urlChk;
const urlsForUser = helpers.urlsForUser;
const urlToUsrChk = helpers.urlToUsrChk;

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const testUrls = {
  kv68u7: {
    longURL: "https://www.testing.ca",
    userID: "cv78uo",
  },
  s5m1p5: {
    longURL: "https://www.mocha.ca",
    userID: "8hbz7i",
  },
  um0w1a: {
    longURL: "http://www.chaijs.com",
    userID: "cv78uo",
  },
  "8hba41": {
    longURL: "https://www.codewars.com",
    userID: "o9zx0u",
  },
};

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";

    assert.strictEqual(user.id, expectedUserID);
  });
  it("should not return a user with valid email", function () {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userWrongID";

    assert.notEqual(user.id, expectedUserID);
  });
});

describe("findUrlbyID", function () {
  it("should return a url id when url exists in urldb", function () {
    const url = findUrlByID("um0w1a", testUrls);
    const expectedUrlID = "um0w1a";

    assert.strictEqual(url, expectedUrlID);
  });
  it("should not return a url id when url does not exists in urldb", function () {
    const url = findUrlByID("nonexistingid", testUrls);

    assert.equal(url, undefined);
  });
});

describe("addUser", function () {
  it("returns the userdb with users +1", function () {
    const newUserDbLength = 3;
    const newUser = { email: "newuser@yahoo.com", password: "mister" };
    addUser("randomid", newUser, testUsers);

    assert.strictEqual(newUserDbLength, Object.keys(testUsers).length);
  });
});

describe("addURL", function () {
  it("returns the urldb with urls +1", function () {
    const newUrlDbLength = 5;
    addURL("randomid", "random", "random", testUrls);

    assert.strictEqual(newUrlDbLength , Object.keys(testUrls).length);
  });
});

describe("urlChk", function () {
  it("true if given url is found", function () {
    const url = "um0w1a";

    assert.isTrue(urlChk(url, testUrls));
  });

  it("false if db does not contain url", function () {
    const url = "000000";
    //False - reality check
    assert.isTrue(urlChk(url, testUrls));
  });
});






