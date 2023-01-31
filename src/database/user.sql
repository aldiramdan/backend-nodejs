DROP TABLE IF EXISTS users;
CREATE TABLE users (
    users_id BIGSERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    picture VARCHAR(255),
    role INT DEFAULT 0,
    refresh_token VARCHAR,
    email_verified BOOLEAN DEFAULT FALSE,
    token_email_verify VARCHAR,
    expired_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);