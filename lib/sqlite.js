const sqlite3 = require('sqlite3').verbose();
const sqllite = require('sqlite');
const {
    dbInsertDataCheck,
    dbDeleteDataCheck,
    dbGetDealsByAccountCheck,
    dbGetDealsByIDCheck,
    dbUpdateDealStatusCheck } = require('./functionCheck.js');

var db = null;

async function openSQLite(){
    db = await sqllite.open({
        filename: './db/deals.db',
        mode: sqlite3.OPEN_READWRITE,
        driver: sqlite3.Database
    });
}

async function closeSQLite(){
    if(db == null) return;
    await db.close();
    db = null;
}

function createJsonAnswer(statusCode, msg, list = []){
    return JSON.stringify({
        code: statusCode,
        msg: msg,
        list: list,
    });
}

async function dbInsertData(buyer, seller, value, unit){
    if(db == null)
        return createJsonAnswer(600, "Connection error");
    check = dbInsertDataCheck(buyer, seller, value, unit);
    if(check != null)
        return check;
    isError = await db.run(`INSERT INTO Deals(buyer, seller, value, unit) VALUES(?, ?, ?, ?)`, [buyer, seller, value, unit], function(err) {
        console.log(err)
    });
    console.log(isError);
    if(isError.lastID == undefined)
        return createJsonAnswer(610, "Error: row hasn`t been inserted");
    return createJsonAnswer(0, "The deal has been inserted", [isError.lastID]);
}

async function dbUpdateData(buyer, seller, value, unit, id){
    check = dbInsertDataCheck(buyer, seller, value, unit); // TODO: id check
    if(check != null)
        return check;
    if(db == null)
        return createJsonAnswer(600, "Connection error");
    isError = await db.run(`UPDATE Deals SET buyer = ?, seller = ?, value = ?, unit = ? WHERE id = ?`, [buyer, seller, value, unit, id], function(err) {
        console.log(err)
    });
    if(isError.lastID == undefined)
        return createJsonAnswer(610, "Error: row hasn`t been inserted");
    return createJsonAnswer(0, "The deal has been update", [isError.lastID]);
}

async function dbDeleteData(id){
    check = dbDeleteDataCheck(id);
    if(check != null)
        return check;
    if(db == null)
        return createJsonAnswer(600, "Connection error");
    isError = await db.run(`DELETE FROM Deals WHERE id = ?`, [id], function(err) {
        console.log(err)
    });
    if(isError.lastID == undefined)
        return createJsonAnswer(620, "Error: can`t delete deal");
    return createJsonAnswer(0, "The deal has been deleted");
}

async function dbGetDealsByAccount(account){
    check = dbGetDealsByAccountCheck(account);
    if(check != null)
        return check;
    if(db == null)
        return createJsonAnswer(600, "Connection error");
    dealsList = await db.all(`SELECT * FROM deals WHERE buyer = ? OR seller = ?`, [account, account], function(err, rows){
        console.log(err)
    });
    if(dealsList.length == 0){
        return createJsonAnswer(630, "Error: can`t get deals by account");}
    return createJsonAnswer(0, "Deals have been filtered by account", dealsList);
}

async function dbGetDealsByID(id){
    check = dbGetDealsByIDCheck(id);
    if(check != null)
        return check;
    if(db == null)
        return createJsonAnswer(600, "Connection error");
    dealsList = await db.all(`SELECT * FROM deals WHERE id = ?`, [id], function(err, rows){
        console.log(err)
    });
    if(dealsList.length == undefined){
        return createJsonAnswer(630, "Error: can`t get deals by id");}
    return createJsonAnswer(0, "Deals have been filtered by id", dealsList);
}

async function dbUpdateDealStatus(id, status) {
    //TODO: проверка status - отличие не более чем на 1
    check = dbUpdateDealStatusCheck(id, status);
    if(check != null)
        return check;
    if(db == null)
        return createJsonAnswer(600, "Connection error");
    isError = await db.run(`UPDATE deals SET status = ? WHERE id = ?`, [status, id], function(err) {
        console.log(err)
    });
    if(isError.lastID == undefined)
        return createJsonAnswer(604, "Error: can`t update deal`s status");
    return createJsonAnswer(0, "Deal`s status have been updated");
}

module.exports = {
    openSQLite,
    closeSQLite,
    dbInsertData,
    dbUpdateData,
    dbDeleteData,
    dbGetDealsByAccount,
    dbGetDealsByID,
    dbUpdateDealStatus
}

//TODO: сначала добавить метод для вставки данных в бд на сервере, если все норм, то только потом переходить в смартконтракт

/*
Error list:
600 - connection error
610 - create deal error
    611 - address invalid
    612 - self transaction error
    613 - value invalid
    614 - params are undefined
    615 - unit is invalid error
620 - delete deal error
    621 - id invalid
    624 - params are undefined
630 - get deals by account error
    631 - address invalid
    634 - params are undefined
640 - status update error
    641 - address invalid
    642 - self transaction error
    643 - value invalid
    644 - params are undefined
*/

/*TODO: 
добавить новое поле "txid" типа TEXT,
Создать функцию вставки этого поля в строку по id
*/