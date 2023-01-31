const ctrl = {}
const models = require('../models/schedule')
const response = require('../lib/response')

ctrl.getData = async (req, res) => {
    try {
        const result = await models.findAllSchedule()
        if (result.length <= 0) {
            return response(res, 404, { data: result.length, message: 'data not found!' })
        }
        return response(res, 200, result)
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
        const result = await models.findSchedulePagination(query)
        const count = await models.countSchedule()
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
        const result = await models.findScheduleById(query)
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
        const result = await models.findScheduByName(query)
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
        const user = req.userData
        const query = {
            premiere: req.body.premiere,
            location_schedule: req.body.location_schedule,
            price: req.body.price,
            date_start: req.body.date_start,
            date_end: req.body.date_end,
            movie_id: req.body.movie_id,
            users_id: user.users_id
        }
        const checkMovie = await models.checkDataMovie(query)
        const checkSchedule = await models.checkDataSchedule(query)
        if (checkMovie <= 0) {
            return response(res, 401, { message: 'data movie not found!' })
        } else if (!req.body.premiere) {
            return response(res, 401, { message: 'premiere is required' })
        } else if (!req.body.location_schedule) {
            return response(res, 401, { message: 'location is required' })
        } else if (checkSchedule.length >= 1) {
            return response(res, 401, { message: 'schedule has been used' })
        }
        const result = await models.addSchedule(query)
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
        const user = req.userData
        const query = {
            id: req.params.id,
            premiere: req.body.premiere,
            location_schedule: req.body.location_schedule,
            price: req.body.price,
            time_schedule: req.body.time_schedule,
            date_start: req.body.date_start,
            date_end: req.body.date_end,
            movie_id: req.body.movie_id,
            users_id: user.users_id
        }
        const checkId = await models.checkDataExist(query)
        const checkMovie = await models.checkDataMovie(query)
        const checkSchedule = await models.checkDataUpdateSchedule(query)
        if (checkId.length <= 0) {
            return response(res, 404, { message: 'data not found!' })
        } else if (checkMovie <= 0) {
            return response(res, 404, { message: 'data movie not found!' })
        } else if (!req.body.premiere) {
            return response(res, 401, { message: 'premiere is required' })
        } else if (!req.body.location_schedule) {
            return response(res, 401, { message: 'location is required' })
        } else if (checkSchedule.length >= 1) {
            return response(res, 401, { message: 'schedule has been used' })
        }
        const result = await models.updateSchedule(query)
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
        const deleted = await models.deleteSchedule(query)
        return response(res, 203, { data: result.length, message: 'data successfully deleted!' })   
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.deleteAllData = async (req, res) => {
    try {
        const result = await models.findAllSchedule()
        if (result.length <= 0) {
            return response(res, 401, { data: result.length, message: 'data not found!' })
        }
        const deleted = await models.deleteAllSchedule()
        return response(res, 203, { data: result.length, message: 'data successfully deleted!' })
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = ctrl