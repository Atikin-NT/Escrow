const supabaseLib = require('@supabase/supabase-js');
const { ARB_REW_ETH, DEAL_STATUS } = require("./utils.js")

const { SPBS_URL, SERVICE_KEY} = process.env;
const supabase = supabaseLib.createClient(SPBS_URL, SERVICE_KEY)

exports.isAdmin = async (address) => {
    const { count, error } = await supabase
    .from('Admins')
    .select('*', { count: 'exact', head: true })
    .eq('address', address)
    return count;
}

exports.getDealsDoneCount = async () => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('status', DEAL_STATUS.FINISHED)
    return count;
}

exports.getTotalAmount = async () => {
    const { data, error } = await supabase.rpc('gettotalamount');
    const { count, err } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .neq('arbitrator', null)
    return data + count * ARB_REW_ETH;
}

exports.getOpenAmount = async () => {
    const { data, error } = await supabase.rpc('getopenmount');
    return data;
}

exports.getFeeTotalAmount = async () => {
    const { data, error } = await supabase.rpc('getfeetotalamount');
    return data;
}

exports.getDealsCount = async () => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    return count;
}

exports.getAdminHelpDealCount = async () => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .neq('arbitrator',  null)
    return count;
}

exports.getNeedsYourHelpCount = async (address) => {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('arbitrator',  address)
    return count;
}