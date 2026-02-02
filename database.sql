CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    mileage INT NOT NULL,
    description TEXT,
    body_type VARCHAR(255),
    price DECIMAL(10, 2),
    condition VARCHAR(255),
    color VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAM,
);

CREATE TABLE car_images (
    id SERIAL PRIMARY KEY,
    car_id INT REFERENCES cars(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL
);

CREATE TABLE ads (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    button_text VARCHAR(255) NOT NULL,

);
CREATE TABLE reviews(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
