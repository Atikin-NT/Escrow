const ethers = require('ethers');

function createJsonAnswer(statusCode, msg, list = []){
    return JSON.stringify({
        code: statusCode,
        msg: msg,
        list: list,
    });
}

function dbInsertDataCheck(buyer, seller, value, unit){
    if(value == null || buyer == null || seller == null || unit == null){
        return createJsonAnswer(614, 'Not all params was reseved');
    }
    if(!(ethers.utils.isAddress(buyer) && ethers.utils.isAddress(seller)))
        return createJsonAnswer(611, 'Buyer`s or seller`s address is invalid');
    if(buyer == seller)
        return createJsonAnswer(612, 'Self transaction error')
    if(typeof(value) != "number" || value <= 0)
        return createJsonAnswer(613, 'Value is invalid (value <= 0)');
    if(typeof(value) != "number" || unit < 0 || unit > 3)
        return createJsonAnswer(615, 'Unit is invalid (unit < 0 or unit > 3)');
    return null;
}

function dbDeleteDataCheck(id){
    if(id == null || typeof(id) != "number"){
        return createJsonAnswer(624, 'Not all params was reseved');
    }
    if(id < 0)
        return createJsonAnswer(621, 'Id is invalid (id < 0)');
    return null;
}

function dbGetDealsByAccountCheck(account){
    if(account == null)
        return createJsonAnswer(634, 'Not all params was reseved');
    if(!ethers.utils.isAddress(account))
        return createJsonAnswer(631, 'Buyer`s or seller`s address is invalid');
    return null;
}

function dbGetDealsByIDCheck(id){
    if((typeof(id) != "number" && typeof(id) != "string") || id == null || id == undefined)
        return createJsonAnswer(614, 'Id was not reseved');
    if(typeof(id) == "number" && id < 0)
        return createJsonAnswer(613, 'Id is invalid (value <= 0)');
    if (typeof id == "string" && parseInt(id) < 0)
        return createJsonAnswer(613, 'Id is invalid (value <= 0)');
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

module.exports = {
    dbInsertDataCheck,
    dbDeleteDataCheck,
    dbGetDealsByAccountCheck,
    dbGetDealsByIDCheck,
    dbUpdateDealStatusCheck
}