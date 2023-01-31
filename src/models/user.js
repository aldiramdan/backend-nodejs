const models = {}
const db = require('../configs/db')

models.allUsers = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.users'
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.getProfile = ({users_id}) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT email, username, email_verified, picture FROM public.users WHERE users_id=$1'
        ,
        [users_id]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.updateProfile = ({picture, username}) => {
    return new Promise((resolve, reject) => {
        db.query(`
            UPDATE public.users
                SET picture = $1
                WHERE username=$2
                RETURNING email, username, picture;`
        ,
        [picture, username]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.getMovie = ({users_id, limit, offset}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT title, release_date, category, duration, director, casts, description, image
                FROM public.movie
                LEFT JOIN users USING (users_id)
                WHERE users_id=$1
                LIMIT $2 OFFSET $3;`
        ,
        [users_id, limit, offset]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.getSchedule = ({users_id, limit, offset}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT premiere, title, duration, date_start, date_end, location_schedule, price
                FROM public.schedule
                LEFT JOIN movie USING (movie_id)
                WHERE schedule.users_id=$1
                LIMIT $2 OFFSET $3;`
        ,
        [users_id, limit, offset]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.getBooking = ({users_id, limit, offset}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT booking_id, title, date_booking, premiere, location_schedule, seat, price, totalprice
                FROM public.booking
                LEFT JOIN schedule USING (schedule_id)
                LEFT JOIN movie USING (movie_id)
                WHERE booking.users_id=$1
                LIMIT $2 OFFSET $3;`
        ,
        [users_id, limit, offset]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.getCountMovie = ({users_id}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT COUNT(*) AS total
                FROM public.movie
                LEFT JOIN users USING (users_id)
                WHERE users_id=$1`
        ,
        [users_id]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.getCountSchedule = ({users_id}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT COUNT(*) AS total
                FROM public.schedule
                LEFT JOIN movie USING (movie_id)
                WHERE schedule.users_id=$1;`
        ,
        [users_id]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.getCountBooking = ({users_id}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT COUNT(*) AS total
                FROM public.booking
                WHERE booking.users_id=$1;`
        ,
        [users_id]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

module.exports = models