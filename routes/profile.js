const { GoogleSignIn } = require('../lib/sqlite.js');
const { OAuth2Client } = require('google-auth-library');

async function SignIn(req, res){
    const CLIENT_ID = "748097504037-h7g5a4cqoj65keosu0mbfv4rumm0hf6i.apps.googleusercontent.com";
    const token = req.body.credential;

    const csrf_token_cookie = req.cookies.g_csrf_token;
    if (csrf_token_cookie === undefined){
        res.status(400).send('<h1>No CSRF token in Cookie.</h1>');
        return;
    }
    const g_csrf_token = req.body.g_csrf_token;
    if (g_csrf_token === undefined){
        res.status(400).send('<h1>No CSRF token in post body.</h1>');
        return;
    }
    if (csrf_token_cookie !== g_csrf_token){
        res.status(400).send('<h1>Failed to verify double submit cookie.</h1>')
        return;
    }

    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      console.log(payload)
      return payload;
    }
    const payload = await verify().catch(console.error);
    const answer = await GoogleSignIn(payload.sub, payload.name, payload.email, payload.picture);
    console.log(answer);
    res.redirect('/');
}

module.exports = {SignIn};