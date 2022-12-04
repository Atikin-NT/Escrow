require("dotenv").config();
const {
    dbInsertDataCheck,
    dbDeleteDataCheck,
    dbGetDealsByAccountCheck,
    dbGetDealsByIDCheck,
    dbUpdateDealStatusCheck,
    dbsetTxIdCheck } = require('./functionCheck.js');
const { createJsonAnswer } = require('./createJsonAns.js');
const { isAdmin } = require('../lib/adminInfo.js');

const supabaseLib = require('@supabase/supabase-js');

const { SPBS_URL, SERVICE_KEY} = process.env;
const supabase = supabaseLib.createClient(SPBS_URL, SERVICE_KEY)



async function dbInsertData(buyer, seller, value, sellerIsAdmin, fee, feeRole){
    check = dbInsertDataCheck(buyer, seller, value, sellerIsAdmin, fee, feeRole);
    if(check != null)
        return check;

    const { data, error } = await supabase
    .from('deals')
    .insert([
        { 
            "buyer": buyer.toLowerCase(), 
            "seller": seller.toLowerCase(),
            "value": value,
            "sellerIsAdmin": sellerIsAdmin,
            "fee": fee,
            "feeRole": feeRole
         },
    ])
    .select()

    if(error != null)
        return createJsonAnswer(610, "Error: row hasn`t been inserted");
    return createJsonAnswer(0, "The deal has been inserted", [data[0].id]);
}

async function dbUpdateData(buyer, seller, value, id, sellerIsAdmin, fee, feeRole){
    check = dbInsertDataCheck(buyer, seller, value, sellerIsAdmin, fee, feeRole); // TODO: id check
    if(check != null)
        return check;

    const { data, error } = await supabase
    .from('deals')
    .update({ 
            "buyer": buyer.toLowerCase(), 
            "seller": seller.toLowerCase(),
            "value": value,
            "sellerIsAdmin": sellerIsAdmin,
            "fee": fee,
            "feeRole": feeRole
     })
     .eq('id', `${id}`)

    if(error != null)
        return createJsonAnswer(610, "Error: row hasn`t been inserted");
    return createJsonAnswer(0, "The deal has been update", [id]);
}

async function dbDeleteData(id){
    check = dbDeleteDataCheck(id);
    if(check != null)
        return check;

    const { data, error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id)

    if(error != null)
        return createJsonAnswer(620, "Error: can`t delete deal");
    return createJsonAnswer(0, "The deal has been deleted");
}

async function dbGetDealsByAccount(account, limit){
    check = dbGetDealsByAccountCheck(account);
    if(check != null)
        return check;

    const is_admin = await isAdmin(account);
    let res_data, res_error;

    if (is_admin != 0){
        const {data, error} = await supabase
        .from('deals')
        .select('*')
        .order('status', {ascending: true})
        .order('id', {ascending: false})
        .limit(limit);
        res_data = data;
        res_error = error;
    }
    else{
        const {data, error} = await supabase
        .from('deals')
        .select('*')
        .or(`buyer.eq.${account.toLowerCase()},seller.eq.${account.toLowerCase()}`)
        .order('status', {ascending: true})
        .order('id', {ascending: false})
        .limit(limit);
        res_data = data;
        res_error = error;
    }
    
    if(res_error != null)
        return createJsonAnswer(630, "Error: can`t get deals by account");
    return createJsonAnswer(0, "Deals have been filtered by account", res_data);
}

async function dbGetDealsToHelp(account, limit){
    const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('arbitrator', account.toLowerCase())
    .eq('status', 3)
    .order('value', {ascending: true})
    .order('id', {ascending: false})
    .limit(limit)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by account");
    return createJsonAnswer(0, "Deals have been filtered by account", data);
}

async function dbGetDealsByID(id){
    check = dbGetDealsByIDCheck(id);
    if(check != null)
        return check;

    const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by id");
    return createJsonAnswer(0, "Deals have been filtered by id", data);
}

async function dbGetDealsByTxID(txId){
    // check = dbGetDealsByIDCheck(id);
    // if(check != null)
    //     return check;

    const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('txId', txId)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by id");
    return createJsonAnswer(0, "Deals have been filtered by id", data);
}

async function setTxId(id, txId){
    check = dbsetTxIdCheck(id, txId);
    if(check != null)
        return check;

    const { data, error } = await supabase
    .from('deals')
    .update({ "txId": txId })
    .eq('id', id)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by id");
    return createJsonAnswer(0, "Deals have been filtered by id", data);
}

async function setTxHash(id, txHash){
    // check = dbsetTxIdCheck(id, txId);
    // if(check != null)
    //     return check;

    const { data, error } = await supabase
    .from('deals')
    .update({ "txHash": txHash })
    .eq('id', id)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by id");
    return createJsonAnswer(0, "Deals have been filtered by id", data);
}

async function setTxIdByHash(txHash, txId){
    // check = dbsetTxIdCheck(id, txId);
    // if(check != null)
    //     return check;

    const { data, error } = await supabase
    .from('deals')
    .update({ "txId": txId })
    .eq('txHash', txHash)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by txHash");
    return createJsonAnswer(0, "Deals have been filtered by txHash", data);
}

async function setArbitrator(txId, arbitrator){
    const { data, error } = await supabase
    .from('deals')
    .update({ "arbitrator": arbitrator })
    .eq('txId', txId)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by txHash");
    return createJsonAnswer(0, "Deals have been filtered by txHash", data);
}

async function dbUpdateDealStatus(txId, status) {
    check = dbUpdateDealStatusCheck(txId, status);
    if(check != null)
        return check;

    const { data, error } = await supabase
    .from('deals')
    .update({ "status": status })
    .eq('txId', txId)

    if(error != null)
        return createJsonAnswer(604, "Error: can`t update deal`s status");
    return createJsonAnswer(0, "Deal`s status have been updated");
}

async function dbUpdateDealStatusById(id, status) {
    // check = dbUpdateDealStatusCheck(txId, status);
    // if(check != null)
    //     return check;

    const { data, error } = await supabase
    .from('deals')
    .update({ "status": status })
    .eq('id', id)

    if(error != null)
        return createJsonAnswer(604, "Error: can`t update deal`s status");
    return createJsonAnswer(0, "Deal`s status have been updated");
}

module.exports = {
    dbInsertData,
    dbUpdateData,
    dbDeleteData,
    dbGetDealsByAccount,
    dbGetDealsToHelp,
    dbGetDealsByID,
    dbGetDealsByTxID,
    dbUpdateDealStatus,
    dbUpdateDealStatusById,
    setTxId,
    setTxHash,
    setTxIdByHash,
    setArbitrator
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