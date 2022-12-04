const supabaseLib = require('@supabase/supabase-js');
const { createJsonAnswer } = require('./createJsonAns.js');

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
    .eq('status', 4)
    return count;
}

exports.getTotalAmount = async () => {
    const { data, error } = await supabase.rpc('gettotalamount');
    return data;
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

exports.solveDealByAdmin = async (dealID, account, priory) => {
    if(!isAdmin(account)){
        return createJsonAnswer(701, "Error: you are not an admin");
    }
    const { data, error } = await supabase
    .from('deals')
    .update({ need_admin_help: 'false' , status: 4})
    .eq('id', dealID)
    console.log(data, error);
    return createJsonAnswer(0, "Deal have been solved");
}
