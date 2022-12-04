const supabaseLib = require('@supabase/supabase-js');

const { SPBS_URL, SERVICE_KEY} = process.env;
const supabase = supabaseLib.createClient(SPBS_URL, SERVICE_KEY)


const getDoneDealsCount = async (account) => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .or(`buyer.eq.${account},seller.eq.${account}`)
    .eq('status', 4)
    return count;
}

const getUserTotalAmount = async (account) => {
    const { data, error } = await supabase.rpc('getusertotalamount', {account : account});
    return data;
}

const getOpenDealsCount = async (account) => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .or(`buyer.eq.${account},seller.eq.${account}`)
    .neq('status', 4)
    return count;
}

const getOpenDealsAmount = async (account) => {
    const { data, error } = await supabase.rpc('getuseropenamount', {account : account});
    return data;
}

module.exports = { 
    getDoneDealsCount, 
    getUserTotalAmount,
    getOpenDealsCount,
    getOpenDealsAmount
};