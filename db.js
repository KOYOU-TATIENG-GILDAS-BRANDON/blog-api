const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1111111111", 
  database: "blog_db"
});

db.connect((err) => {
  if (err) {
    console.log("Erreur connexion DB :", err);
  } else {
    console.log("Connecté à MySQL");
  }
});

module.exports = db;