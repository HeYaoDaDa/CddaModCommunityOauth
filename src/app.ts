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
console.log(process.env.CLIENT_ID)
const app = express()

app.get('/token/create', async function (req, res) {
    const token = await githubAuth.code.getToken(req.originalUrl)
    return res.json(token.data)
})

app.post('/token/refresh', async function (req, res) {
    const old_token = new ClientOAuth2.Token(githubAuth, req.body)
    const new_token = await old_token.refresh()
    return res.json(new_token.data)
})

app.listen(9999)