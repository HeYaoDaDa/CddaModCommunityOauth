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

app.get('/token/create', async function (req, res) {
    console.log('/token/create trigger')
    const token = await githubAuth.code.getToken(req.originalUrl)
    res.setHeader('Access-Control-Allow-Origin', process.env.WEB_SITE_URL)
    return res.json(token.data)
})

app.post('/token/refresh', async function (req, res) {
    console.log('/token/refresh trigger')
    const old_token = new ClientOAuth2.Token(githubAuth, req.body)
    const new_token = await old_token.refresh()
    res.setHeader('Access-Control-Allow-Origin', process.env.WEB_SITE_URL)
    return res.json(new_token.data)
})

app.listen(9999)