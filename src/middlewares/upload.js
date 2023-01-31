const middleware = {}
const response = require('../lib/response')
const multer = require('multer')

middleware.file = (req, res, next) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/')
        },
        filename: (req, file, cb) => {
            const typeFile = file.mimetype.split('/')[1]
            if (typeFile !== 'png' && typeFile !== 'jpg' && typeFile !== 'jpeg') {  
                cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
            } else {
                cb(null, file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + `.${typeFile}`)
            }
        }
    })

    const limits = { fileSize: 5 * 1024 * 1024 }
    const upload = multer({storage, limits}).single('image')

    upload(req, res, (error) => {
        if(error instanceof multer.MulterError){
            return response(res, 401, error.message)
        } else if (error) {
            return response(res, 500, error.message)
        }
        next()
    })
}

module.exports = middleware