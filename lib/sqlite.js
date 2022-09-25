const sqlite3 = require('sqlite3').verbose();
let db = null;

function open(){
    db = new sqlite3.Database('./db/deals.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            db = null;
            return console.error(err.message);
        }
        console.log('Connected to the Deals SQlite database.');
    });
}

function close(){
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
    db = null;
}

exports.dbInsertData = (buyer, seller, value) => {
    open();
    if(db == null) return; //TODO: return exception connect error
    db.run(`INSERT INTO Deals(buyer, seller, value) VALUES(?, ?, ?)`, [buyer, seller, value], function(err) {
        if (err) {
            jsonResult = JSON.stringify([{"msg": "err.message"}]);
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
    close();
}

exports.dbDeleteData = (id) => {
    open();
    var jsonResult;
    if(db == null) return; //TODO: return exception connect error
    db.run(`DELETE FROM Deals WHERE id = ?`, [id], function(err) {
        if (err) {
            jsonResult = JSON.stringify([{"msg": "err.message"}]);
            return console.log(err.message);
        }
        console.log(`A row has been deleted`);
        jsonResult = JSON.stringify([{"msg": "ok"}]);
        console.log(jsonResult);
    });
    close();
}

exports.dbGetDealsByAccount = (account) => {
    open();
    var jsonResult;
    if(db == null) return; //TODO: return exception connect error
    db.all(`SELECT * FROM deals WHERE buyer = ? OR seller = ?`, [account, account], function(err, rows){
        if (err) {
            jsonResult = JSON.stringify([{"msg": "err.message"}]);
            return console.log(err.message);
        }
        console.log(`Select completed`);
        jsonResult = JSON.stringify(rows);
        console.log(jsonResult);
    });
    close();
}

exports.dbUpdateDealStatus = (id, status) => {
    open();
    if(db == null) return; //TODO: return exception connect error
    db.run(`UPDATE deals SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err) {
            jsonResult = JSON.stringify([{"msg": "err.message"}]);
            return console.log(err.message);
        }
        console.log(`status update`);
    });
    close();
}