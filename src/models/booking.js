const models = {}
const db = require('../configs/db')

models.findAllBooking = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT booking_id, title, date_booking, premiere, location_schedule, seat, price, totalprice
                FROM public.booking
                LEFT JOIN schedule USING (schedule_id)
                LEFT JOIN movie USING (movie_id)
                ORDER BY title ASC, price ASC;`
            ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.findBookingPagination = ({ limit, offset }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT booking_id, title, date_booking, premiere, location_schedule, seat, price, totalprice
                FROM public.booking
                LEFT JOIN schedule USING (schedule_id)
                LEFT JOIN movie USING (movie_id)
                ORDER BY booking_id
                LIMIT $1 OFFSET $2;`
                ,
                [limit, offset]
            ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.findBookingById = ({ id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT booking_id, title, date_booking, premiere, location_schedule, seat, price, totalprice
                FROM public.booking
                LEFT JOIN schedule USING (schedule_id)
                LEFT JOIN movie USING (movie_id)
                WHERE booking_id=$1;`
        ,
        [id]
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.findBookingByName = ({ name }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT booking_id, title, date_booking, price, seat, totalprice
                FROM public.booking
                LEFT JOIN schedule USING (schedule_id)
                LEFT JOIN movie USING (movie_id)
                WHERE title ILIKE '%'||$1||'%'
                ORDER BY title ASC;`
                ,
                [name]
            ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.addBooking = ({ seat, date_booking, totalprice, schedule_id, users_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO public.booking 
                (seat, date_booking, totalprice, schedule_id, users_id)
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *;`
            , 
            [seat, date_booking, totalprice, schedule_id, users_id]
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.updateBooking = ({ seat, date_booking, totalprice, schedule_id, users_id, id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE booking
                SET seat = $1,
                    date_booking = $2,
                    totalprice = $3,
                    schedule_id = $4,
                    users_id = $5,
                    updated_at = now()
                WHERE booking_id = $6
                RETURNING *;`
            , 
            [seat, date_booking, totalprice, schedule_id, users_id, id]
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.deleteBooking = ({ id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM public.booking WHERE booking_id=$1;'
            , 
            [id]
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.deleteAllBooking = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM public.booking;'
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.checkDataExist = ({ id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM public.booking WHERE booking_id=$1;'
            ,
            [id]
        ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.checkDataPrice = ({ schedule_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT price FROM public.booking 
                RIGHT JOIN schedule USING (schedule_id) WHERE schedule_id=$1`
            ,
            [schedule_id]
        ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.checkDataSeat = ({ schedule_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT seat FROM public.booking WHERE schedule_id=$1;'
            ,
            [schedule_id]
        ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.checkDataUpdateSeat = ({ schedule_id, id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT seat FROM public.booking WHERE schedule_id=$1 AND NOT booking_id=$2;'
            ,
            [schedule_id, id]
        ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.checkDataDate = ({ schedule_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT date_start, date_end 
                FROM public.booking 
                RIGHT JOIN schedule USING (schedule_id) 
                WHERE schedule_id=$1;`
            ,
            [schedule_id]
        ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.checkNullSeat = ({ id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE booking SET seat = (array[null]) WHERE booking_id=$1'
            ,
            [id]
        ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.checkDateBooking = ({ schedule_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT date_booking FROM public.booking WHERE schedule_id=$1;'
            ,
            [schedule_id]
        ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.countBooking = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT COUNT(*) AS total FROM public.booking;'
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
             reject(err)
        })
    })
}

module.exports = models