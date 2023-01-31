const express = require('express')
const routers = express.Router()
const ctrl = require('../controllers/schedule')
const middle = require('../middlewares/auth')

routers.get('/', ctrl.getData)
routers.get('/p', ctrl.getDataPagination)
routers.get('/id=:id', ctrl.getDataById)
routers.get('/s', ctrl.getDataByName)
routers.post('/', middle.authentiocation, middle.isAdmin, ctrl.addData)
routers.put('/:id', middle.authentiocation, middle.isAdmin, ctrl.updateData)
routers.delete('/id=:id', middle.authentiocation, middle.isAdmin, ctrl.deleteData)
routers.delete('/', middle.authentiocation, middle.isSuperAdmin, ctrl.deleteAllData)

module.exports = routers