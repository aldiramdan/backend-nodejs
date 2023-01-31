const response = require('../lib/response')
const nodemailer = require('nodemailer')
require('dotenv').config()

const sendMail = async (email, subject, link) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            },
        })
        await transporter.sendMail({
            from: 'noreply@gmail.com',
            to: email,
            subject: subject,
            text: 'Verify your account.\n' +link,
            html: `<a href="${link}">Verify Email.</a>`
        });
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = sendMail