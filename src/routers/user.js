const express = require('express')
const routers = express.Router()
const ctrl = require('../controllers/user')
const middle = require('../middlewares/auth')
const upload = require('../middlewares/upload')

routers.get('/profile', middle.authentiocation, ctrl.getProfile)
routers.put('/profile', middle.authentiocation, upload.file, ctrl.updateProfile)
routers.delete('/profile', middle.authentiocation, upload.file, ctrl.deleteProfile)

routers.get('/movie', middle.authentiocation, middle.isAdmin, ctrl.getMovie)
routers.get('/schedule', middle.authentiocation, middle.isAdmin, ctrl.getSchedule)
routers.get('/booking', middle.authentiocation, middle.isUser, ctrl.getBooking)

module.exports = routers