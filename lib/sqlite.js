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



exports.dbInsertData = async (buyer, seller, value, sellerIsAdmin, fee, feeRole) => {
    check = dbInsertDataCheck(buyer, seller, value, sellerIsAdmin, fee, feeRole);
    if(check != null)
        return check;

    const { data, error } = await supabase
    .from('deals')
    .insert([
        { 
            "buyer": buyer, 
            "seller": seller,
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

exports.dbUpdateData = async (buyer, seller, value, id, sellerIsAdmin, fee, feeRole) => {
    check = dbInsertDataCheck(buyer, seller, value, sellerIsAdmin, fee, feeRole); // TODO: id check
    if(check != null)
        return check;

    const { data, error } = await supabase
    .from('deals')
    .update({ 
            "buyer": buyer, 
            "seller": seller,
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

exports.dbDeleteData = async (id) => {
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

exports.dbGetDealsByAccount = async (account, limit) => {
    check = dbGetDealsByAccountCheck(account);
    if(check != null)
        return check;
    
    const {data, error} = await supabase
    .from('deals')
    .select('*')
    .or(`buyer.eq.${account},seller.eq.${account}`)
    .order('status', {ascending: true})
    .order('id', {ascending: false})
    .limit(limit);
    
    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by account");
    return createJsonAnswer(0, "Deals have been filtered by account", data);
}

exports.dbGetDealsToHelp = async (account, limit) => {
    if (!(await isAdmin(account))) 
        return createJsonAnswer(403, "Error: acces forbidden");

    const {data, error} = await supabase
    .from('deals')
    .select('*')
    .order('status', {ascending: true})
    .order('id', {ascending: false})
    .limit(limit);

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by account");
    return createJsonAnswer(0, "Deals have been filtered by account", data);
}

exports.dbGetDealsByID = async (id) => {
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

exports.dbGetDealsByTxID = async (txId) => {
    const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('txId', txId)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by id");
    return createJsonAnswer(0, "Deals have been filtered by id", data);
}

exports.setTxId = async (id, txId) => {
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

exports.setTxHash = async (id, txHash) => {
    const { data, error } = await supabase
    .from('deals')
    .update({ "txHash": txHash })
    .eq('id', id)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by id");
    return createJsonAnswer(0, "Deals have been filtered by id", data);
}

exports.setTxIdByHash = async (txHash, txId) => {
    const { data, error } = await supabase
    .from('deals')
    .update({ "txId": txId })
    .eq('txHash', txHash)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by txHash");
    return createJsonAnswer(0, "Deals have been filtered by txHash", data);
}

exports.setArbitrator = async (txId, arbitrator) => {
    const { data, error } = await supabase
    .from('deals')
    .update({ "arbitrator": arbitrator })
    .eq('txId', txId)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by txHash");
    return createJsonAnswer(0, "Deals have been filtered by txHash", data);
}

exports.dbUpdateDealStatus = async (txId, status) => {
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

exports.dbUpdateDealStatusById = async (id, status) => {
    const { data, error } = await supabase
    .from('deals')
    .update({ "status": status })
    .eq('id', id)

    if(error != null)
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