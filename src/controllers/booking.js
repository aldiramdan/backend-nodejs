const ctrl = {}
const models = require('../models/booking')
const response = require('../lib/response')

ctrl.getData = async (req, res) => {
    try {
        const result = await models.findAllBooking()
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
        const result = await models.findBookingPagination(query)
        const count = await models.countBooking()
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
        const result = await models.findBookingById(query)
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
        const result = await models.findBookingByName(query)
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
        const schedule = {
            schedule_id: req.body.schedule_id
        }
        const price = await models.checkDataPrice(schedule)
        const date = await models.checkDataDate(schedule)
        const dateBooking = await models.checkDateBooking(schedule)

        if (price.length <= 0 && date.length <= 0) {
            return response(res, 404, { message: 'data schedule not found!' })
        }

        const query = {
            seat: req.body.seat ,
            date_booking: req.body.date_booking,
            totalprice: req.body.seat.length * price[0].price,
            schedule_id: req.body.schedule_id,
            users_id: user.users_id
        }
        
        const newDate = new Date(query.date_booking).toLocaleString('en', {timeZone: 'America/New_York'})
        const newDateS = new Date(date[0].date_start).toLocaleString('en', {timeZone: 'America/New_York'})
        const newDateE = new Date(date[0].date_end).toLocaleString('en', {timeZone: 'America/New_York'})

        const seat = await models.checkDataSeat(schedule)

        if (seat.length > 0) {
            for (let i = 0; i < seat.length; i++) {
                for (let j = 0; j < seat[i].seat.length; j++) {
                    for (let k = 0; k < query.seat.length; k++) {
                        if (seat[i].seat[j] === query.seat[k] && new Date(dateBooking[i].date_booking).toLocaleString('en', {timeZone: 'America/New_York'}) === newDate){
                            return response(res, 401, `seat ${query.seat[k]} has been booking`)
                        }
                    }
                }
            }
        }

        if (!query.seat) {
            return response(res, 401, { message: 'seat is required' })
        } else if (!query.date_booking) {
            return response(res, 401, { message: 'date is required' })
        } else if (newDateS >= newDate || newDate <= newDateE) {
            return response(res, 401, { message: 'date schedule has been expired!' })
        }
        const result = await models.addBooking(query)
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
        const queryCheck = {
            id: req.params.id,
            schedule_id: req.body.schedule_id
        }

        const checkId = await models.checkDataExist(queryCheck)
        const price = await models.checkDataPrice(queryCheck)
        const date = await models.checkDataDate(queryCheck)
        const dateBooking = await models.checkDateBooking(queryCheck)

        if (checkId.length <= 0) {
            return response(res, 404, { message: 'data not found!' })
        } else if (price.length <= 0) {
            return response(res, 404, { message: 'data schedule not found!' })
        }

        const query = {
            id: req.params.id,
            seat: req.body.seat,
            date_booking: req.body.date_booking,
            totalprice: req.body.seat.length * price[0].price,
            schedule_id: req.body.schedule_id,
            users_id: user.users_id
        }

        const newDate = new Date(query.date_booking).toLocaleString('en', {timeZone: 'America/New_York'})
        const newDateS = new Date(date[0].date_start).toLocaleString('en', {timeZone: 'America/New_York'})
        const newDateE = new Date(date[0].date_end).toLocaleString('en', {timeZone: 'America/New_York'})

        const seat = await models.checkDataUpdateSeat(queryCheck)
        if (seat.length > 0) {
            for (let i = 0; i < seat.length; i++) {
                for (let j = 0; j < seat[i].seat.length; j++) {
                    for (let k = 0; k < query.seat.length; k++) {
                        if (seat[i].seat[j] === query.seat[k] && new Date(dateBooking[i].date_booking).toLocaleString('en', {timeZone: 'America/New_York'}) === newDate) {
                            return response(res, 401, `Seat ${query.seat[k]} has been Booking`)
                        }
                    }
                }
            }
        }
        
        if (!query.seat) {
            return response(res, 401, { message: 'seat is required' })
        } else if (!query.date_booking) {
            return response(res, 401, { message: 'date is required' })
        } else if (newDateS >= newDate || newDate <= newDateE) {
            return response(res, 401, { message: 'date schedule has been expired!' })
        }
        const result = await models.updateBooking(query)
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
            return response(res, 404,  { data: result.length, message: 'data not found!' })
        }
        const deleted = await models.deleteBooking(query)
        return response(res, 203,  { data: result.length, message: 'data successfully deleted!' })  
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.deleteAllData = async (req, res) => {
    try {
        const result = await models.findAllBooking()
        if (result.length <= 0) {
            return response(res, 404, { data: result.length, message: 'data not found!' })
        }
        const deleted = await models.deleteAllBooking()
        return response(res, 203, { data: result.length, message: 'data successfully deleted!' })
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = ctrl