const supabaseLib = require('@supabase/supabase-js');
const { DEAL_STATUS } = require("./utils.js")

const { SPBS_URL, SERVICE_KEY} = process.env;
const supabase = supabaseLib.createClient(SPBS_URL, SERVICE_KEY)


/**
 * Количество закрытых сделок аккаунта
 * @param  {string} account
 */
exports.getDoneDealsCount = async (account) => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .or(`buyer.eq.${account},seller.eq.${account}`)
    .eq('status', DEAL_STATUS.FINISHED)
    return count;
}

/**
 * Сумма value открытых сделок аккаунта
 * @param  {string} account
 * @returns {Promise<number|null>}
 */
exports.getUserTotalAmount = async (account) => {
    const { data, error } = await supabase.rpc('getusertotalamount', {account : account});
    return data;
}

/**
 * Количество открытых сделок аккаунта
 * @param  {string} account
 */
exports.getOpenDealsCount = async (account) => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .or(`buyer.eq.${account},seller.eq.${account}`)
    .neq('status', DEAL_STATUS.FINISHED)
    return count;
}

/**
 * Сумма value закрытых сделок аккаута
 * @param  {string} account
 * @returns {Promise<number|null>}
 */
exports.getOpenDealsAmount = async (account) => {
    const { data, error } = await supabase.rpc('getuseropenamount', {account : account});
    return data;
}
