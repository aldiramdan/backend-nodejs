const models = {}
const db = require('../configs/db')

models.findAllSchedule = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT schedule_id, premiere, title, duration, date_start, date_end, location_schedule, price
                FROM public.schedule
                LEFT JOIN movie USING (movie_id)
                ORDER BY premiere ASC, location_schedule ASC;`
            )
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.findScheduleById = ({ id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT schedule_id, premiere, title, duration, date_start, date_end, location_schedule, price 
                FROM public.schedule 
                LEFT JOIN movie USING (movie_id)
                WHERE schedule_id=$1;`
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


models.findSchedulePagination = ({ limit, offset }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT schedule_id, premiere, title, duration, date_start, date_end, location_schedule, price
                 FROM public.schedule 
                 LEFT JOIN movie USING (movie_id)
                 ORDER BY schedule_id 
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

models.findScheduByName = ({ name }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT schedule_id, premiere, title, duration, date_start, date_end, location_schedule, price
                FROM public.schedule
                LEFT JOIN movie USING (movie_id)
                WHERE title ILIKE '%'||$1||'%'
                ORDER BY location_schedule ASC, price ASC;`
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


models.addSchedule = ({ premiere, location_schedule, price, date_start, date_end, movie_id, users_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO public.schedule 
                (premiere, location_schedule, price, date_start, date_end, movie_id, users_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING *;`
            , 
            [premiere, location_schedule, price, date_start, date_end, movie_id, users_id]
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.updateSchedule = ({ premiere, location_schedule, price, date_start, date_end, movie_id, users_id, id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE schedule
                SET premiere = $1,
                    location_schedule = $2,
                    price = $3,
                    date_start = $4,
                    date_end = $5,
                    movie_id = $6,
                    users_id= $7,
                    updated_at = now()
                WHERE schedule_id = $8
                RETURNING *;`
            , 
            [premiere, location_schedule, price, date_start, date_end, movie_id, users_id, id]
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.deleteSchedule = ({ id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM public.schedule WHERE schedule_id=$1;'
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

models.deleteAllSchedule = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM public.schedule;'
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
            'SELECT * FROM public.schedule WHERE schedule_id=$1;'
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

models.checkDataSchedule = ({ premiere, location_schedule, movie_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM public.schedule 
                WHERE premiere ILIKE $1
                AND location_schedule ILIKE $2
                AND movie_id=$3;`
                ,
                [premiere, location_schedule, movie_id]
            ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.checkDataUpdateSchedule = ({ premiere, location_schedule, movie_id, id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM public.schedule 
                WHERE premiere ILIKE $1
                AND location_schedule ILIKE $2
                AND movie_id=$3
                AND NOT schedule_id=$4;`
                ,
                [premiere, location_schedule, movie_id, id]
            ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.checkDataMovie = ({ movie_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM public.schedule 
                RIGHT JOIN movie USING (movie_id) WHERE movie_id=$1`
            ,
            [movie_id]
        ).then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.countSchedule = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT COUNT(*) AS total FROM public.schedule;'
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
             reject(err)
        })
    })
}

module.exports = models