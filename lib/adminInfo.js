const supabaseLib = require('@supabase/supabase-js');

const { SPBS_URL, SERVICE_KEY} = process.env;
const supabase = supabaseLib.createClient(SPBS_URL, SERVICE_KEY)

async function isAdmin(address){
    const { data, error } = await supabase
    .from('Admins')
    .select('*')
    .eq('address', address)
    console.log("isAdmin: ", data, error);
}

async function getDealsDoneCount(){
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 4)
    console.log("getDealsDoneCount: ", count, error);
    return count;
}

async function getTotalAmount(){
    const { data, error } = await supabase.rpc('gettotalamount');
    console.log("getTotalAmount: ", data, error);
    return data;
}

async function getFeeTotalAmount(){
    const { data, error } = await supabase.rpc('getfeetotalamount');
    console.log("getFeeTotalAmount: ", data, error);
    return data;
}

async function getDealsCount(){
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    console.log("getDealsCount: ", count, error);
    return count;
}

async function getAdminHelpDealCount(){
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('need_admin_help', 1)
    console.log("getAdminHelpDealCount: ", count, error);
    return count;
}

module.exports = { 
    getDealsDoneCount, 
    getTotalAmount,
    getFeeTotalAmount,
    getDealsCount,
    getAdminHelpDealCount
};