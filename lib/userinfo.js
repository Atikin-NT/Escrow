const supabaseLib = require('@supabase/supabase-js');
const { DEAL_STATUS } = require("./utils.js")

const { SPBS_URL, SERVICE_KEY} = process.env;
const supabase = supabaseLib.createClient(SPBS_URL, SERVICE_KEY)


exports.getDoneDealsCount = async (account) => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .or(`buyer.eq.${account},seller.eq.${account}`)
    .eq('status', DEAL_STATUS.FINISHED)
    return count;
}

exports.getUserTotalAmount = async (account) => {
    const { data, error } = await supabase.rpc('getusertotalamount', {account : account});
    return data;
}

exports.getOpenDealsCount = async (account) => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .or(`buyer.eq.${account},seller.eq.${account}`)
    .neq('status', DEAL_STATUS.FINISHED)
    return count;
}

exports.getOpenDealsAmount = async (account) => {
    const { data, error } = await supabase.rpc('getuseropenamount', {account : account});
    return data;
}
