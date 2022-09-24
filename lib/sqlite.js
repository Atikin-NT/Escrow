const sqlite3 = require('sqlite3').verbose();
exports.dbTest = () => {
    let db = new sqlite3.Database('../db/deals.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the Deals SQlite database.');
    });
    db.run(`INSERT INTO Deals VALUES(?)`, ['C'], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}