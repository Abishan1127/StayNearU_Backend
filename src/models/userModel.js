const db = require("../config/db");

class User {
  static getAllUsers() {
    return db.query("SELECT * FROM user");
  }
}

module.exports = User;
