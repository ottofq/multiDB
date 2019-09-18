const bcrypt = require("bcrypt");
const { promisify } = require("util");

const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);
const saltRounds = parseInt(process.env.SALT);
class PasswordHelper {
  static hashPassword(pass) {
    return hashAsync(pass, saltRounds);
  }

  static comparePassword(pass, hash) {
    return compareAsync(pass, hash);
  }
}

module.exports = PasswordHelper;
