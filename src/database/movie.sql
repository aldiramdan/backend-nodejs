DROP TABLE IF EXISTS movie;
CREATE TABLE movie (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    release_date DATE NOT NULL,
    category VARCHAR,
    duration INT DEFAULT 0,
    director VARCHAR,
    casts VARCHAR,
    description TEXT,
    image VARCHAR,
    users_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT fk_users FOREIGN KEY (users_id) REFERENCES users (users_id)
);