SELECT * FROM test;

CREATE TABLE posts (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR NOT NULL,
    comment VARCHAR NOT NULL,
    embedding vector (1536) NOT NULL,
    created_by VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL,
    origin_lat DOUBLE PRECISION NOT NULL,
    origin_lng DOUBLE PRECISION NOT NULL,
    origin_name VARCHAR NOT NULL,
    point1_lat DOUBLE PRECISION NOT NULL,
    point1_lng DOUBLE PRECISION NOT NULL,
    point1_name VARCHAR NOT NULL,
    point2_lat DOUBLE PRECISION NOT NULL,
    point2_lng DOUBLE PRECISION NOT NULL,
    point2_name VARCHAR NOT NULL,
    point3_lat DOUBLE PRECISION NOT NULL,
    point3_lng DOUBLE PRECISION NOT NULL,
    point3_name VARCHAR NOT NULL
)

CREATE TABLE users(
    id VARCHAR PRIMARY KEY NOT NULL,
    name VARCHAR NOT NULL,
    img_url VARCHAR NOT NULL
)

ALTER TABLE users DROP COLUMN id;
ALTER TABLE posts DROP COLUMN id;
ALTER TABLE users ADD COLUMN id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY;
ALTER TABLE posts ADD COLUMN id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY;

ALTER TABLE users ADD COLUMN gender VARCHAR NOT NULL;
ALTER TABLE users ADD COLUMN age INT NOT NULL;
ALTER TABLE users DROP COLUMN id;
ALTER TABLE users ADD COLUMN id VARCHAR PRIMARY KEY NOT NULL;

DELETE FROM users

DELETE FROM posts