const bcrypt = require("bcryptjs");

const pass1 = bcrypt.hashSync("iamnoone", 10);

console.log(pass1);