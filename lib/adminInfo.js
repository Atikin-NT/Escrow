const supabaseLib = require('@supabase/supabase-js');

const { SPBS_URL, SERVICE_KEY} = process.env;
const supabase = supabaseLib.createClient(SPBS_URL, SERVICE_KEY)

async function isAdmin(address){
    const { count, error } = await supabase
    .from('Admins')
    .select('*', { count: 'exact', head: true })
    .eq('address', address)
    return count;
}

async function getDealsDoneCount(){
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 4)
    return count;
}

async function getTotalAmount(){
    const { data, error } = await supabase.rpc('gettotalamount');
    return data;
}

async function getOpenAmount() {
    const { data, error } = await supabase.rpc('getopenmount');
    return data;
}

async function getFeeTotalAmount(){
    const { data, error } = await supabase.rpc('getfeetotalamount');
    return data;
}

async function getDealsCount(){
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    return count;
}

async function getAdminHelpDealCount(){
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .neq('arbitrator',  null)
    return count;
}

async function getNeedsYourHelpCount(address) {
    const { count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('arbitrator',  address)
    return count;
}

module.exports = { 
    getDealsDoneCount, 
    getTotalAmount,
    getOpenAmount,
    getFeeTotalAmount,
    getDealsCount,
    getAdminHelpDealCount,
    isAdmin,
    getNeedsYourHelpCount
};