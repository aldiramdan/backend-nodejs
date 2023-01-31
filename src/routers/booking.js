const express = require('express')
const routers = express.Router()
const ctrl = require('../controllers/booking')
const middle = require('../middlewares/auth')

routers.get('/', middle.authentiocation, middle.isSuperAdmin, ctrl.getData)
routers.get('/p', middle.authentiocation, middle.isSuperAdmin, ctrl.getDataPagination)
routers.get('/id=:id', middle.authentiocation, middle.isSuperAdmin, ctrl.getDataById)
routers.get('/s', middle.authentiocation, middle.isSuperAdmin, ctrl.getDataByName)
routers.post('/', middle.authentiocation, middle.isUser, ctrl.addData)
routers.put('/:id', middle.authentiocation, middle.isUser, ctrl.updateData)
routers.delete('/id=:id', middle.authentiocation, middle.isUser, ctrl.deleteData)
routers.delete('/', middle.authentiocation, middle.isSuperAdmin, ctrl.deleteAllData)

module.exports = routers