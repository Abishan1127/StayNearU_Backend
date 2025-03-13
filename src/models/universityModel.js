const db = require("../config/db");

class University {
  static getAllUniversities() {
    return db.query("SELECT * FROM university");
  }
}

module.exports = University;
