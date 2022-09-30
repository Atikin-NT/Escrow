const sqlite3 = require('sqlite3').verbose();
const sqllite = require('sqlite');
let db = null;

async function open(){
    db = await sqllite.open({
        filename: './db/deals.db',
        mode: sqlite3.OPEN_READWRITE,
        driver: sqlite3.Database
    });
    console.log('Connected to the Deals SQlite database.');
}

async function close(){
    await db.close();
    db = null;
    console.log('Close the database connection.');
}

function createJsonAnswer(statusCode, msg, list = []){
    return JSON.stringify({
        code: statusCode,
        msg: msg,
        list: list,
    });
}

exports.dbInsertData = async (buyer, seller, value) => {
    await open();
    if(db == null)
        return createJsonAnswer(600, "Connection error");
    isError = await db.run(`INSERT INTO Deals(buyer, seller, value) VALUES(?, ?, ?)`, [buyer, seller, value], function(err) {
        if (err)
            return true;
        return false;
    });
    await close();
    if(isError.lastID == undefined)
        return createJsonAnswer(601, "Error: row hasn`t been inserted");
    return createJsonAnswer(0, "The deal has been inserted");
}

exports.dbDeleteData = async (id) => {
    await open();
    if(db == null)
        return createJsonAnswer(600, "Connection error");
    isError = await db.run(`DELETE FROM Deals WHERE id = ?`, [id], function(err) {
        if (err)
            return true;
        return false;
    });
    await close();
    if(isError.lastID == undefined)
        return createJsonAnswer(602, "Error: can`t delete deal");
    return createJsonAnswer(0, "The deal has been deleted");
}

exports.dbGetDealsByAccount = async (account) => {
    await open();
    if(db == null)
        return createJsonAnswer(600, "Connection error");
    dealsList = await db.all(`SELECT * FROM deals WHERE buyer = ? OR seller = ?`, [account, account], function(err, rows){
        if (err)
            return null;
        return rows;
    });
    await close();
    if(dealsList == null){
        return createJsonAnswer(603, "Error: can`t get deals by account");}
    return createJsonAnswer(0, "Deals have been filtered by account", dealsList);
}

exports.dbUpdateDealStatus = async (id, status) => {
    await open();
    if(db == null)
        return createJsonAnswer(600, "Connection error");
    isError = await db.run(`UPDATE deals SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err)
            return true;
        return false;
    });
    await close();
    if(isError.lastID == undefined)
        return createJsonAnswer(604, "Error: can`t update deal`s status");
    return createJsonAnswer(0, "Deal`s status have been updated");
}

//TODO: сначала добавить метод для вставки данных в бд на сервере, если все норм, то только потом переходить в смартконтракт

/*
Error list:
600 - connection error
601 - create deal error
602 - delete deal error
603 - get deals by account error
604 - status update error
*/