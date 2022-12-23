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



/**
 * Используется для создания записи о сделке
 * @param  {string} buyer
 * @param  {string} seller
 * @param  {float} value
 * @param  {boolean} sellerIsAdmin
 * @param  {float} fee
 * @param  {int} feeRole
 * @returns {Promise<createJsonAnswer>} id сделки
 */
exports.dbInsertData = async (buyer, seller, value, sellerIsAdmin, fee, feeRole) => {
    const check = dbInsertDataCheck(buyer, seller, value, sellerIsAdmin, fee, feeRole);
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

/**
 * Используется для изменения записи о сделке
 * @param  {string} buyer
 * @param  {string} seller
 * @param  {float} value
 * @param  {int} id
 * @param  {boolean} sellerIsAdmin
 * @param  {float} fee
 * @param  {int} feeRole
 * @returns {Promise<createJsonAnswer>} id сделки
 */
exports.dbUpdateData = async (buyer, seller, value, id, sellerIsAdmin, fee, feeRole) => {
    const check = dbInsertDataCheck(buyer, seller, value, sellerIsAdmin, fee, feeRole); // TODO: id check
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

/**
 * Используется для удаления записи о сделке
 * @param  {int} id
 * @returns {Promise<createJsonAnswer>}
 */
exports.dbDeleteData = async (id) => {
    const check = dbDeleteDataCheck(id);
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

/**
 * Сделки аккаунта. status: asc, id: desc
 * @param  {string} account
 * @param  {int} limit размер выборки
 * @returns {Promise<createJsonAnswer>}
 */
exports.dbGetDealsByAccount = async (account, limit) => {
    const check = dbGetDealsByAccountCheck(account);
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

/**
 * Сделки аккаунта. id: desc
 * @param  {string} account
 * @param  {int} limit размер выборки
 * @returns {Promise<createJsonAnswer>}
 */
exports.dbGetDealsByAccountIDDesc = async (account, limit) => {
    const check = dbGetDealsByAccountCheck(account);
    if(check != null)
        return check;
    
    const {data, error} = await supabase
    .from('deals')
    .select('*')
    .or(`buyer.eq.${account},seller.eq.${account}`)
    .order('id', {ascending: false})
    .limit(limit);
    
    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by account");
    return createJsonAnswer(0, "Deals have been filtered by account", data);
}

/**
 * Сделки. status: asc, id: desc
 * @param  {string} account
 * @param  {int} limit размер выборки
 */
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

/**
 * Сделка по id
 * @param  {int} id
 * @returns {Promise<createJsonAnswer>}
 */
exports.dbGetDealsByID = async (id) => {
    const check = dbGetDealsByIDCheck(id);
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

/**
 * Сделка по txId
 * @param  {string} txId
 */
exports.dbGetDealsByTxID = async (txId) => {
    const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('txId', txId)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by id");
    return createJsonAnswer(0, "Deals have been filtered by id", data);
}

/**
 * Установка txId в запись о сделке по id
 * @param  {int} id
 * @param  {string} txId
 * @returns {Promise<createJsonAnswer>}
 */
exports.setTxId = async (id, txId) => {
    const check = dbsetTxIdCheck(id, txId);
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

/**
 * Установка txHash в запись о сделке по id
 * @param  {int} id
 * @param  {string} txHash
 */
exports.setTxHash = async (id, txHash) => {
    const { data, error } = await supabase
    .from('deals')
    .update({ "txHash": txHash })
    .eq('id', id)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by id");
    return createJsonAnswer(0, "Deals have been filtered by id", data);
}

/**
 * Установка txId в запись о сделке по txHash
 * @param  {string} txHash
 * @param  {string} txId
 */
exports.setTxIdByHash = async (txHash, txId) => {
    const { data, error } = await supabase
    .from('deals')
    .update({ "txId": txId })
    .eq('txHash', txHash)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by txHash");
    return createJsonAnswer(0, "Deals have been filtered by txHash", data);
}

/**
 * Установка арбитра в запись о сделке по txId
 * @param  {string} txId
 * @param  {string} arbitrator
 */
exports.setArbitrator = async (txId, arbitrator) => {
    const { data, error } = await supabase
    .from('deals')
    .update({ "arbitrator": arbitrator })
    .eq('txId', txId)

    if(error != null)
        return createJsonAnswer(630, "Error: can`t get deals by txHash");
    return createJsonAnswer(0, "Deals have been filtered by txHash", data);
}

/**
 * Используется для изменения статуса в записи о сделке по txId
 * @param  {string} txId
 * @param  {int} status
 * @returns {Promise<createJsonAnswer>}
 */
exports.dbUpdateDealStatus = async (txId, status) => {
    const check = dbUpdateDealStatusCheck(txId, status);
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

/**
 * Используется для изменения статуса в записи о сделке по id
 * @param  {int} id
 * @param  {int} status
 */
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