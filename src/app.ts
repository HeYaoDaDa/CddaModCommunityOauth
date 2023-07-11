import axios from 'axios'
import ClientOAuth2 from 'client-oauth2'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const githubAuth = new ClientOAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    accessTokenUri: 'https://github.com/login/oauth/access_token',
    authorizationUri: 'https://github.com/login/oauth/authorize',
    redirectUri: process.env.REDIRECT_URL,
})
const app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
    next();
});

app.use(express.json())

app.get('/token/create', async function (req, res) {
    console.log('/token/create trigger')
    const token = await githubAuth.code.getToken(req.originalUrl)
    return res.json(token.data)
})

app.post('/token/refresh', async function (req, res) {
    console.log('/token/refresh trigger')
    const old_token = new ClientOAuth2.Token(githubAuth, req.body)
    const new_token = await old_token.refresh()
    return res.json(new_token.data)
})

app.get('/device/code', async function (req, res) {
    console.log('/device/code trigger')
    const response = await axios.post(`https://github.com/login/device/code?client_id=${process.env.CLIENT_ID}`)
    const data = new URLSearchParams(response.data)
    const body = {}
    data.forEach((v, k) => body[k] = v)
    return res.json(body)
})

app.get('/device/token', async function (req, res) {
    const deviceCode = req.query.device_code as string
    console.log('/device/token trigger code is ', deviceCode)
    const response = await axios.post(`https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&grant_type=urn:ietf:params:oauth:grant-type:device_code&device_code=${deviceCode}`)
    const data = new URLSearchParams(response.data)
    const body = {}
    data.forEach((v, k) => body[k] = v)
    return res.json(body)
})

app.listen(9999, () => console.log("listen start..."))