const { GoogleSignIn } = require('../lib/sqlite.js');
const jwt_decode = require("jwt-decode");

async function SignIn(req, res){
    console.log(req.body.credential);
    console.log(req.body.g_csrf_token);
    //need to check req.body.g_csrf_token in cookies or smth
    const decoded = jwt_decode(req.body.credential)
    answer = await GoogleSignIn(decoded.sub,decoded.name,decoded.email,decoded.picture);
    console.log(answer);
    res.redirect('profile');
}

module.exports = {SignIn};