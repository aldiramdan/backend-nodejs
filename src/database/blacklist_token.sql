DROP TABLE IF EXISTS blacklist_token;
CREATE TABLE blacklist_token (
    id SERIAL PRIMARY KEY NOT NULL,
    token_blacklist VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);