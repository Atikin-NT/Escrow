const ethers = require('ethers');

function createJsonAnswer(statusCode, msg, list = []){
    return JSON.stringify({
        code: statusCode,
        msg: msg,
        list: list,
    });
}

function dbInsertDataCheck(buyer, seller, value, unit, sellerIsAdmin, fee, feeRole){
    if(value == null || buyer == null || seller == null || unit == null){
        return createJsonAnswer(614, 'Not all params was reseved');
    }
    if(!(ethers.utils.isAddress(buyer) && ethers.utils.isAddress(seller)))
        return createJsonAnswer(611, 'Buyer`s or seller`s address is invalid');
    if(buyer == seller)
        return createJsonAnswer(612, 'Self transaction error')
    if(typeof(value) != "number" || value <= 0)
        return createJsonAnswer(613, 'Value is invalid (value <= 0)');
    if(typeof(unit) != "number" || unit != 0)
        return createJsonAnswer(615, 'Unit is invalid (unit != 0)');
    if(typeof(sellerIsAdmin) != "number" || sellerIsAdmin < 0 || sellerIsAdmin > 1)
        return createJsonAnswer(616, 'sellerIsAdmin is invalid (sellerIsAdmin < 0 or sellerIsAdmin > 2)');
    if(typeof(fee) != "number" || fee < 0)
        return createJsonAnswer(617, 'fee is invalid (fee < 0)');
    if(typeof(feeRole) != "number" || feeRole < 0 || feeRole > 2)
        return createJsonAnswer(618, 'feeRole is invalid (feeRole < 0 or feeRole > 2)');
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

function dbsetTxIdCheck(id, txId){
    if((typeof(id) != "number" && typeof(id) != "string") || id == null || id == undefined)
        return createJsonAnswer(654, 'Id was not reseved');
    if(typeof(id) == "number" && id < 0)
        return createJsonAnswer(653, 'Id is invalid (value <= 0)');
    if (typeof(id) == "string" && parseInt(id) < 0)
        return createJsonAnswer(653, 'Id is invalid (value <= 0)');
    if (typeof(txId) != "string" || !(ethers.utils.isHexString(txId)))
        return createJsonAnswer(653, 'txId is invalid (txId is not Hex String)');
}

module.exports = {
    dbInsertDataCheck,
    dbDeleteDataCheck,
    dbGetDealsByAccountCheck,
    dbGetDealsByIDCheck,
    dbUpdateDealStatusCheck,
    dbsetTxIdCheck
}