const sqlite3 = require('sqlite3').verbose();
const sqllite = require('sqlite');
const ethers = require('ethers');

let db = null;

async function open(){
    db = await sqllite.open({
        filename: './db/deals.db',
        mode: sqlite3.OPEN_READWRITE,
        driver: sqlite3.Database
    });
    // console.log('Connected to the Deals SQlite database.');
}

async function close(){
    await db.close();
    db = null;
    // console.log('Close the database connection.');
}

function createJsonAnswer(statusCode, msg, list = []){
    return JSON.stringify({
        code: statusCode,
        msg: msg,
        list: list,
    });
}

function dbInsertDataCheck(buyer, seller, value){
    if(value == null || buyer == null || seller == null || typeof(value) != "number"){
        return createJsonAnswer(614, 'Not all params was reseved');
    }
    if(!(ethers.utils.isAddress(buyer) && ethers.utils.isAddress(seller)))
        return createJsonAnswer(611, 'Buyer`s or seller`s address is invalid');
    if(buyer == seller)
        return createJsonAnswer(612, 'Self transaction error')
    if(value <= 0)
        return createJsonAnswer(613, 'Value is invalid (value <= 0)');
    return null;
}

exports.dbInsertData = async (buyer, seller, value) => {
    check = dbInsertDataCheck(buyer, seller, value);
    if(check != null)
        return check;

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
        return createJsonAnswer(610, "Error: row hasn`t been inserted");
    return createJsonAnswer(0, "The deal has been inserted");
}

function dbDeleteDataCheck(id){
    if(id == null || typeof(id) != "number"){
        return createJsonAnswer(624, 'Not all params was reseved');
    }
    if(id < 0)
        return createJsonAnswer(621, 'Id is invalid (id < 0)');
    return null;
}

exports.dbDeleteData = async (id) => {
    check = dbDeleteDataCheck(id);
    if(check != null)
        return check;
    
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
        return createJsonAnswer(620, "Error: can`t delete deal");
    return createJsonAnswer(0, "The deal has been deleted");
}

function dbGetDealsByAccountCheck(account){
    if(account == null)
        return createJsonAnswer(634, 'Not all params was reseved');
    if(!ethers.utils.isAddress(account))
        return createJsonAnswer(631, 'Buyer`s or seller`s address is invalid');
    return null;
}

exports.dbGetDealsByAccount = async (account) => {
    check = dbGetDealsByAccountCheck(account);
    if(check != null)
        return check;
    
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
        return createJsonAnswer(630, "Error: can`t get deals by account");}
    return createJsonAnswer(0, "Deals have been filtered by account", dealsList);
}

function dbUpdateDealStatusCheck(id, status){
    if(id == null || status == null || typeof(id) != "number" || typeof(status) != "number")
        return createJsonAnswer(644, 'Not all params was reseved');
    if(id < 0)
        return createJsonAnswer(641, 'Id is invalid');
    if(status < 0 || status > 4)
        return createJsonAnswer(642, 'Status is invalid')
    return null;
}

exports.dbUpdateDealStatus = async (id, status) => {
    check = dbUpdateDealStatusCheck(id, status);
    if(check != null)
        return check;
    
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
610 - create deal error
    611 - address invalid
    612 - self transaction error
    613 - value invalid
    614 - params are undefined
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