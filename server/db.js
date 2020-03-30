/** Database for poc-sripe */

const pg = require("pg");

const db = new pg.Client("postgresql:///poc-stripe");

db.connect();

module.exports = db;
