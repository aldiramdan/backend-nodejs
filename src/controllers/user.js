const ctrl = {}
const models = require('../models/user')
const response = require('../lib/response')
const fs = require('fs')

ctrl.getProfile = async (req, res) => {
    try {
        const user = req.userData
        const profile = await models.getProfile({users_id: user.users_id})
        const linkImage = `${process.env.BASE_URL}/public/${profile[0].picture}`
        return response(res, 200, {profile, picture: linkImage})
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.updateProfile = async (req, res) => {
    try {
        const user = req.userData
        const users = await models.getProfile({users_id: user.users_id})
        
        const picture = req.file ? req.file.filename : 'image-default.jpeg'
        if (users[0].picture !== 'image-default.jpeg') {
            fs.unlinkSync(`./public/${users[0].picture}`)
        }
        
        const query = {
            picture: picture,
            username: user.username
        }
                
        const profile = await models.updateProfile(query)
        const linkImage = `${process.env.BASE_URL}/public/${profile[0].picture}`
        return response(res, 200, {profile, picture: linkImage})
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.deleteProfile = async (req, res) => {
    try {
        const user = req.userData
        const users = await models.getProfile({users_id: user.users_id})
        const picture = req.file ? req.file.filename : 'image-default.jpeg'
        
        const query = {
            picture: picture,
            username: user.username
        }
                
        const profile = await models.updateProfile(query)
        const linkImage = `${process.env.BASE_URL}/public/${profile[0].picture}`
        return response(res, 200, {profile, picture: linkImage})
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.getMovie = async (req, res) => {
    try {
        const user = req.userData
        if (!req.userData) {
            return response(res, 401, { message: 'u need login first' })
        }

        const query = {
            users_id: user.users_id,
            page: req.query.page || 1,
            limit: req.query.perpage || 5,
            offset: (req.query.page - 1) * req.query.perpage
        }

        const result = await models.getMovie(query)
        if (result.length <= 0 ) {
            return response(res, 401, { data: result.length, message: 'data not found!' })
        }

        const count = await models.getCountMovie({users_id: query.users_id})
        const total = parseInt(count[0].total)
        const paginationInfo = {
            page: query.page,
            perpage: query.limit,
            totalPages: Math.ceil(total/query.limit)
        }

        return response(res, 200, result, paginationInfo)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.getSchedule = async (req, res) => {
    try {
        const user = req.userData
        if (!req.userData) {
            return response(res, 401, { message: 'u need login first' })
        }

        const query = {
            users_id: user.users_id,
            page: req.query.page || 1,
            limit: req.query.perpage || 5,
            offset: (req.query.page - 1) * req.query.perpage
        }

        const result = await models.getSchedule(query)
        if (result.length <= 0 ) {
            return response(res, 401, { data: result.length, message: 'data not found!' })
        }

        const count = await models.getCountSchedule({users_id: query.users_id})
        const total = parseInt(count[0].total)
        const paginationInfo = {
            page: query.page,
            perpage: query.limit,
            totalPages: Math.ceil(total/query.limit)
        }

        return response(res, 200, result, paginationInfo)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.getBooking = async (req, res) => {
    try {
        const user = req.userData
        if (!req.userData) {
            return response(res, 401, { message: 'u need login first' })
        }

        const query = {
            users_id: user.users_id,
            page: req.query.page || 1,
            limit: req.query.perpage || 5,
            offset: (req.query.page - 1) * req.query.perpage
        }

        const result = await models.getBooking({users_id: user.users_id})
        if (result.length <= 0 ) {
            return response(res, 401, { data: result.length, message: 'data not found!' })
        }

        const count = await models.getCountBooking({users_id: query.users_id})
        const total = parseInt(count[0].total)
        const paginationInfo = {
            page: query.page,
            perpage: query.limit,
            totalPages: Math.ceil(total/query.limit)
        }

        return response(res, 200, result, paginationInfo)
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = ctrl