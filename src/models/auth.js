const models = {}
const db = require('../configs/db')

models.register = ({email, username, password, picture, role, email_verified, token_email_verify, expired_at}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO public.users 
                (email, username, password, picture, role, email_verified, token_email_verify, expired_at) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;`
        ,
        [email, username, password, picture, role, email_verified, token_email_verify, expired_at]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.loginEmail = ({email}) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.users WHERE email=$1'
        ,
        [email]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.loginUser = ({username}) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.users WHERE username=$1'
        ,
        [username]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.newRefreshToken = ({refresh_token, username}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE public.users
                SET refresh_token = $1
                WHERE username = $2
                RETURNING *;`
        ,
        [refresh_token, username]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.checkRefreshToken = ({refresh_token}) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM public.users WHERE refresh_token=$1;'
        ,
        [refresh_token]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.checkTokenEmail = ({token_email_verify}) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM public.users WHERE token_email_verify=$1;'
        ,
        [token_email_verify]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.verifyEmail = ({email_verified, username}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE public.users
                SET email_verified = $1
                WHERE username = $2
                RETURNING email, username;`
        ,
        [email_verified, username]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.resendTokenEmail = ({token_email_verify, expired_at, username}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE public.users
                SET token_email_verify = $1,
                    expired_at = $2
                WHERE username=$3
                RETURNING email, username, token_email_verify;`
        ,
        [token_email_verify, expired_at, username]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.addBlacklist = ({token_blacklist}) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO public.blacklist_token
                (token_blacklist)
                VALUES ($1);`
        ,
        [token_blacklist]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.checkBlacklist = ({token_blacklist}) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.blacklist_token WHERE token_blacklist=$1'
        ,
        [token_blacklist]
        )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

models.autoDeleteTokenBlacklist = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM blacklist_token 
                WHERE created_at < now() - INTERVAL '3 hours';`
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