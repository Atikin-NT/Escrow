const supabaseLib = require('@supabase/supabase-js');
const { ARB_REW_ETH, DEAL_STATUS } = require("./utils.js")
const { createJsonAnswer } = require('./createJsonAns.js');

const { SPBS_URL, SERVICE_KEY} = process.env;
const supabase = supabaseLib.createClient(SPBS_URL, SERVICE_KEY)

/**
 * Аккаунт принадлежит администратору
 * @param  {string} address
 */
exports.isAdmin = async (address) => {
    const { count, error } = await supabase
    .from('Admins')
    .select('*', { count: 'exact', head: true })
    .eq('address', address)
    return count > 0;
}

/**
 * Количество закрытых сделок
 */
exports.getDealsDoneCount = async () => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('status', DEAL_STATUS.FINISHED)
    return count;
}

/**
 * Сумма fee закртых сделок и стоимости услуг арбитража
 * @returns {Promise<number|null>}
 */
exports.getTotalAmount = async () => {
    const { data, error } = await supabase.rpc('gettotalamount');
    const { count, err } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .neq('arbitrator', null)
    return data + count * ARB_REW_ETH;
}

/**
 * Сумма value открытых сделок
 * @returns {Promise<number|null>}
 */
exports.getOpenAmount = async () => {
    const { data, error } = await supabase.rpc('getopenmount');
    return data;
}

/**
 * Сумма fee сделок
 * @returns {Promise<number|null>}
 */
exports.getFeeTotalAmount = async () => {
    const { data, error } = await supabase.rpc('getfeetotalamount');
    return data;
}

/**
 *  Количество сделок
 */
exports.getDealsCount = async () => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    return count;
}

/**
 * Количество сделок, в которых запрошен арбитр
 */
exports.getAdminHelpDealCount = async () => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .neq('arbitrator',  null)
    return count;
}

/**
 * Открытые сделки, в которых запрошен арбитр. id: desc
 * @param  {int} limit размер выборки
 */
exports.getAdminHelpDeals = async (limit) => {
    const { data, error } = await supabase
    .from('deals')
    .select('*')
    .neq('arbitrator',  null)
    .neq('status', DEAL_STATUS.FINISHED)
    .order('id', {ascending: false})
    .limit(limit);
    return createJsonAnswer(0, "The deal has been update", data)
}

/**
 * Количество сделок, в которых аккаунт является арбитром
 * @param  {string} address
 */
exports.getNeedsYourHelpCount = async (address) => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('arbitrator',  address)
    return count;
}