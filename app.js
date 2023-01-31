const express = require('express')
const server = express()
const cors = require('cors')
const response = require('./src/lib/response')
const router = require('./src/routers/index')
const dbms = require('./src/configs/db')

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use('/public', express.static('public'))
server.use(router)
server.use(cors())

server.all('*', (req, res, next) => {
    response(res, 404, 'Page not found!')
})

dbms.connect()
    .then(() => {
        console.log('Database connected!')
        server.listen(process.env.PORT, () => {
            console.log(`Server is running at http://${process.env.PG_HOST}:${process.env.PORT}/`)
        })
    })
    .catch((err) => {
        console.log(err)
    })