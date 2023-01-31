const ctrl = {}
const models = require('../models/auth')
const response = require('../lib/response')
const mailer = require('../configs/mailer')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const fs = require('fs')

ctrl.register = async (req, res) => {
    try {
        const emailCheck = await models.loginEmail({email: req.body.email})
        const userCheck = await models.loginUser({username: req.body.username})
        const saltRounds = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hashSync(req.body.password, saltRounds)
        const tokenEmail = await crypto.randomBytes(16).toString('hex')
        const expiredAt = new Date( Date.now() + 20000 * 60)
        const picture = req.file ? req.file.filename : 'image-default.jpeg'
        
        if (!req.body.email || !req.body.password) {
            if (picture !== 'image-default.jpeg') fs.unlinkSync(`public/${picture}`)
            return response(res, 401, { message: 'email or password dont empty!'})
        } else if (!validator.isEmail(req.body.email)) {
            if (picture !== 'image-default.jpeg') fs.unlinkSync(`public/${picture}`)
            return response(res, 401, { message: 'invalid email!'})
        } else if (emailCheck.length > 0) {
            if (picture !== 'image-default.jpeg') fs.unlinkSync(`public/${picture}`)
            return response(res, 401, { message: 'email has been registered!'})
        } else if (userCheck.length > 0) {  
            if (picture !== 'image-default.jpeg') fs.unlinkSync(`public/${picture}`)
            return response(res, 401, { message: 'username has been registered!'})
        }
        
        const query = {
            email: req.body.email,
            username: req.body.username,
            password: hashPassword,
            picture: picture,
            role: req.body.role || 0,
            email_verified: false,
            token_email_verify: tokenEmail,
            expired_at: expiredAt
        }

        const link = `${process.env.BASE_URL}/auth/confirm?token=${tokenEmail}`
        const linkResend = `${process.env.BASE_URL}/auth/resend?username=${query.username}`
        await mailer(query.email, 'Email Verification\n', link)
        const result = await models.register(query)
        return response(res, 200, {user: result, status: 'succesfully send verify mail', resend: linkResend})
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.confirmVerify = async (req, res) => {
    try {
        const token = {
            token_email_verify: req.query.token
        }

        const result = await models.checkTokenEmail(token)
        if (result.length <= 0) {
            return response(res, 401, { message: 'your account not registration' })
        }
        
        const user = result[0]
        const currentLocal = Date.now()
        const expiredAt = new Date(user.expired_at).toLocaleString('en', {timeZone: 'America/New_York'})
        const expiredToken = new Date(currentLocal).toLocaleString('en', {timeZone: 'America/New_York'})

        if (user.token_email_verify !== token.token_email_verify) {
            return response(res, 401, { message:'failed verify email' })
        } else if (user.email_verified === true) {
            return response(res, 401, { message: 'already verify email' })
        } else if (expiredAt < expiredToken) {
            return response(res, 401, { message: 'expired verify email, please resend verify again!' })
        }

        const query = {
            email_verified: true,
            username: user.username
        }

        const emailVerify = await models.verifyEmail(query)
        return response(res, 200, { user: emailVerify, message: 'succesfully verify email' })
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.resendVerify = async (req, res) => {
    try {
        const username = {
            username: req.query.username
        }
        const checkUser = await models.loginUser(username)
        const user = checkUser[0]
        if (checkUser.length <= 0) {
            return response(res, 401, { message: 'failed resend verify email!' })
        } else if (user.email_verified === true) {
            return response(res, 401, { message: 'already verify email' })
        }
        const tokenEmail = await crypto.randomBytes(16).toString('hex')
        const expiredAt = new Date( Date.now() + 20000 * 60 )

        const query = {
            token_email_verify: tokenEmail,
            expired_at: expiredAt,
            username: req.query.username
        }
        const link = `${process.env.BASE_URL}/auth/confirm?token=${tokenEmail}`
        await mailer(user.email, 'Email Verification\n', link)
        const result = await models.resendTokenEmail(query)
        return response(res, 200, { user: result, message: 'already resend verify email!' })
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.login = async (req, res) => {
    try {
        const result = await models.loginUser({username: req.body.username})
        const username = result[0]
        if (!username) {
            return response(res, 401, { message: 'u need registration'})
        }

        const compared = await bcrypt.compareSync(req.body.password, username.password)
        if (!compared) {
            return response(res, 401, { message: 'username or password wrong!'})
        } else if (username.email_verified === false) {
            return response(res, 401, { message: 'verify your account!'})
        }

        delete username.password
        delete username.refresh_token
        const accesToken = `Bearer ${jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5m'})}`
        const refreshToken = `Bearer ${jwt.sign(username, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30m'})}`
        const user = await models.newRefreshToken({refresh_token: refreshToken, username: req.body.username})
        delete user[0].password
        delete user[0].refresh_token

        const resp = {
            accesToken,
            refreshToken,
            user
        }
        return response(res, 200, resp)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.token = async (req, res) => {
    try {
        const refreshToken = req.headers.token
        if (!refreshToken) {
            return response(res, 400, { message: 'token required'})
        }
        
        const refreshTokens = await models.checkRefreshToken({refresh_token: refreshToken})
        if (refreshTokens <= 0) {
            return response(res, 400, { message: 'refresh token invalid'})
        }
        const user = refreshTokens[0]
        if (user.refresh_token !== refreshToken) {
            return response(res, 400, { message: 'refresh token invalid'})
        }

        delete user.password
        delete user.refresh_token
        const newAccessToken = jwt.verify(refreshToken.split(' ')[1], process.env.REFRESH_TOKEN_SECRET)
        const accesToken = `Bearer ${jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})}`

        const resp = {
            accesToken
        }
        return response(res, 200, resp)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.logout = async (req, res) => {
    try {
        const token = req.headers.token
        if (!token) {
            return response(res, 401, { message: 'ur already logout'})
        }
        
        const query = {
            refresh_token: null,
            username: req.userData.username 
        }
        
        const blacklisToken = await models.addBlacklist({token_blacklist: token})
        const user = await models.newRefreshToken(query)
        return response(res, 200, { message: 'ur logout'})
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = ctrl