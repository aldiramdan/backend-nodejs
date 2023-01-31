const models = {}
const db = require('../configs/db')

models.findAllMovie = ({ limit, offset }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM public.movie ORDER BY created_at DESC
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

models.findMoviePagination = ({ limit, offset }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM public.movie ORDER BY movie_id
               LIMIT $1 OFFSET $2;`
               ,
               [limit, offset]
            )
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

models.findMovieById = ({ id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM public.movie WHERE movie_id=$1;'
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

models.findMovieByName = ({ name }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM public.movie 
                WHERE title ILIKE '%'||$1||'%';`
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

models.addMovie = ({ title, release_date, category, duration, director, casts, description, image, users_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO public.movie 
                (title, release_date, category, duration, director, casts, description, image, users_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                RETURNING *;`
            , 
            [title, release_date, category, duration, director, casts, description, image, users_id]
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.updateMovie = ({ title, release_date, category, duration, director, casts, description, image, users_id, id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE movie
                SET title = $1,
                    release_date = $2,
                    category = $3,
                    duration = $4,
                    director = $5,
                    casts = $6,
                    description = $7,
                    image = $8,
                    users_id = $9,
                    updated_at = now()
                WHERE movie_id = $10
                RETURNING *;`
            , 
            [title, release_date, category, duration, director, casts, description, image, users_id, id]
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

models.deleteMovie = ({ id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM public.movie WHERE movie_id=$1;'
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

models.deleteAllMovie = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM public.movie;'
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
            'SELECT * FROM public.movie WHERE movie_id=$1;'
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

models.checkDataTitle = ({ title }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM public.movie WHERE title ILIKE $1;'
            ,
            [title]
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
             reject(err)
        })
    })
}

models.checkDataUpdateTitle = ({ title, id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM public.movie WHERE title ILIKE $1 AND NOT movie_id=$2;'
            ,
            [title, id]
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
             reject(err)
        })
    })
}

models.countMovie = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT COUNT(*) AS total FROM public.movie;'
        ).then((res) => {
            resolve(res.rows)
        })
        .catch((err) => {
             reject(err)
        })
    })
}

module.exports = models