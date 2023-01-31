DROP TABLE IF EXISTS schedule CASCADE;
CREATE TABLE schedule (
    schedule_id SERIAL PRIMARY KEY,
    price INT DEFAULT 0,
    date_start TIMESTAMP NOT NULL,
    date_end TIMESTAMP NOT NULL,
    premiere_id INT,
    movie_id INT,
    users_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT fk_premiere FOREIGN KEY (premiere_id) REFERENCES premiere (premiere_id),
    CONSTRAINT fk_movie FOREIGN KEY (movie_id) REFERENCES movie (movie_id),
    CONSTRAINT fk_users FOREIGN KEY (users_id) REFERENCES users (users_id)
);