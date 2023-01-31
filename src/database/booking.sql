DROP TABLE IF EXISTS booking;
CREATE TABLE booking (
    booking_id SERIAL PRIMARY KEY,
    seat INT [] NOT NULL,
    date_booking TIMESTAMP NOT NULL,
    totalprice INT DEFAULT 0,
    schedule_id INT,
    users_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT fk_schedule FOREIGN KEY (schedule_id) REFERENCES schedule (schedule_id),
    CONSTRAINT fk_users FOREIGN KEY (users_id) REFERENCES users (users_id)
);