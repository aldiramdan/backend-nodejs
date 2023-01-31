const express = require('express')
const routers = express.Router()
const ctrl = require('../controllers/auth')
const middle = require('../middlewares/auth')
const upload = require('../middlewares/upload')

routers.post('/register', upload.file, ctrl.register)
routers.get('/confirm', ctrl.confirmVerify)
routers.get('/resend', ctrl.resendVerify)
routers.post('/login', ctrl.login)
routers.post('/token', ctrl.token)
routers.post('/logout', middle.authentiocation, ctrl.logout)

module.exports = routers