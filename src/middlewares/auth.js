const middleware = {}
const response = require('../lib/response')
const jwt = require ('jsonwebtoken')
const models = require('../models/auth')

middleware.authentiocation = async (req, res, next) => {
    try {
        const token = req.headers.token
        if (!token) {
            return response(res, 400, { message: 'token required'})
        }

        const checkBlacklistToken = await models.checkBlacklist({token_blacklist: token})
        const autoDelete = await models.autoDeleteTokenBlacklist()
        if (checkBlacklistToken.length > 0) {
            return response(res, 400, { message: 'u need login again'})
        }
        
        const decoded = await jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET)
        req.userData = decoded
        next( )
    } catch (error) {
        return response(res, 500, error)
    }
}

middleware.isSuperAdmin = async (req, res, next) => {
    try {
        const user = req.userData
        if (user.role === 2) {
            next()
        } else {
            return response(res, 400, { message: 'you dont have access! only for super admin'})
        }
    } catch (error) {
        return response(res, 500, error)
    }
}

middleware.isAdmin = async (req, res, next) => {
    try {
        const user = req.userData
        if (user.role === 1) {
            next()
        } else {
            return response(res, 400, { message: 'you dont have access! only for admin'})
        }
    } catch (error) {
        return response(res, 500, error)
    }
}

middleware.isUser = async (req, res, next) => {
    try {
        const user = req.userData
        if (user.role === 0) {
            next()
        } else {
            return response(res, 400, { message: 'you dont have access! only for user'})
        }
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = middleware