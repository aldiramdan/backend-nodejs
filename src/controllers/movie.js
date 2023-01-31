const ctrl = {}
const models = require('../models/movie')
const response = require('../lib/response')
const fs = require('fs')

ctrl.getData = async (req, res) => {
    try {
        const query = {
            page: req.query.page || 1,
            limit: req.query.perpage || 5,
            offset: (req.query.page - 1) * req.query.perpage
        }

        const result = await models.findAllMovie(query)
        const count = await models.countMovie()
        const total = parseInt(count[0].total)

        const paginationInfo = {
            page: query.page,
            perpage: query.limit,
            totalPages: Math.ceil(total/query.limit)
        }

        if (result.length <= 0) {
            return response(res, 404, { data: result.length, message: 'data not found!' })
        } 
            
        return response(res, 200 , result, paginationInfo)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.getDataPagination = async (req, res) => {
    try {
        const query = {
            page: req.query.page || 1,
            limit: req.query.perpage || 5,
            offset: (req.query.page - 1) * req.query.perpage
        }
        
        const result = await models.findMoviePagination(query)
        const count = await models.countMovie()
        const total = parseInt(count[0].total)

        const paginationInfo = {
            page: query.page,
            perpage: query.limit,
            totalPages: Math.ceil(total/query.limit)
        }
        if (result.length <= 0) {
            return response(res, 404, { data: result.length, message: 'data not found!' })
        }

        return response(res, 200, result, paginationInfo)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.getDataById = async (req, res) => {
    try {
        const query = {
           id: req.params.id
        }
        const result = await models.findMovieById(query)
        if (result.length <= 0) {
            return response(res, 404, { data: result.length, message: 'data not found!' })
        }

        return response(res, 200, result)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.getDataByName = async (req, res) => {
    try {
        const query = {
            name: req.query.name
        }
        const result = await models.findMovieByName(query)
        if (result.length <= 0) {
            return response(res, 404, { data: result.length, message: 'data not found!' })
        }
        return response(res, 200, result)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.addData = async (req, res) => {
    try {
        if (!req.userData) {
            return response(res, 401, { message: 'u need login first' })
        }
        const picture = req.file ? req.file.filename : 'image-default.jpeg'
        const user = req.userData
        const query = {
            title: req.body.title,
            release_date: req.body.release_date,
            category: req.body.category,
            duration: req.body.duration,
            director: req.body.director,
            casts: req.body.casts,
            description: req.body.description,
            image: picture,
            users_id: user.users_id
        }
        const checkTitle = await models.checkDataTitle(query)
        if (!req.body.title) {
            if (picture !== 'image-default.jpeg') fs.unlinkSync(`public/${picture}`)
            return response(res, 401, { message: 'title is required' })
        } else if (!req.body.release_date) {
            if (picture !== 'image-default.jpeg') fs.unlinkSync(`public/${picture}`)
            return response(res, 401, { message: 'release date is required' })
        } else if (checkTitle.length >= 1) {
            if (picture !== 'image-default.jpeg') fs.unlinkSync(`public/${picture}`)
            return response(res, 401, { message: 'title has been used' })
        }

        const result = await models.addMovie(query)
        return response(res, 201, result)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.updateData = async (req, res) => {
    try {
        if (!req.userData) {
            return response(res, 401, { message: 'u need login first' })
        }
        const picture = req.file ? req.file.filename : 'image-default.jpeg'
        const user = req.userData
        const query = {
            id: req.params.id,
            title: req.body.title,
            release_date: req.body.release_date,
            category: req.body.category,
            duration: req.body.duration,
            director: req.body.director,
            casts: req.body.casts,
            description: req.body.description,
            image: picture,
            users_id: user.users_id
        }
        const checkId = await models.checkDataExist(query)
        const checkTitle = await models.checkDataUpdateTitle(query)
        if (checkId.length <= 0) {
            if (picture !== 'image-default.jpeg') fs.unlinkSync(`public/${picture}`)
            return response(res, 404, { message: 'data not found!' })
        } else if (!req.body.title) {
            if (picture !== 'image-default.jpeg') fs.unlinkSync(`public/${picture}`)
            return response(res, 401, { message: 'title is required' })
        } else if (checkTitle.length >= 1) {
            if (picture !== 'image-default.jpeg') fs.unlinkSync(`public/${picture}`)
            return response(res, 401, { message: 'title has been used' })
        }
        const result = await models.updateMovie(query)
        return response(res, 202, result)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.deleteData = async (req, res) => {
    try {
        const query = {
            id: req.params.id
        }
        const result = await models.checkDataExist(query)
        if (result.length <= 0) {
            return response(res, 404, { data: result.length, message: 'data not found!' })
        }
        const deleted = await models.deleteMovie(query)
        return response(res, 203, { data: result.length, message: 'data successfully deleted!' })
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.deleteAllData = async (req, res) => {
    try {
        const result = await models.findAllMovie()
        if (result.length <= 0) {
            return response(res, 404, { data: result.length, message: 'data not found!' })
        }
        const deleted = await models.deleteAllMovie()
        return response(res, 203, { data: result.length, message: 'data successfully deleted!' })
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = ctrl