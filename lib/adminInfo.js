const supabaseLib = require('@supabase/supabase-js');

const supabaseUrl = 'https://uxcoihwhhjairlugxgdm.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Y29paHdoaGphaXJsdWd4Z2RtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2OTMxMDM1OCwiZXhwIjoxOTg0ODg2MzU4fQ._AszPbSyOdPgUEHBhGARG9FXpMo2GchN9ff1ShXD-2w'
const supabase = supabaseLib.createClient(supabaseUrl, SERVICE_KEY)

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