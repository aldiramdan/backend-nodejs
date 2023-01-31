const express = require('express')
const routers = express.Router()

const auth = require('./auth')
const user = require('./user');
const movie = require('./movie')
const schedule = require('./schedule')
const booking = require('./booking')

routers.use('/auth', auth)
routers.use('/user', user)
routers.use('/movie', movie)
routers.use('/schedule', schedule)
routers.use('/booking', booking)

module.exports = routers