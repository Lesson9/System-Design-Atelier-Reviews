DROP DATABASE IF EXISTS ratingsandreviews;
CREATE DATABASE ratingsandreviews;

\c ratingsandreviews;

-- # Create a temporary reviews table

DROP TABLE IF EXISTS tempreviews;
CREATE TABLE tempreviews (
  id INT PRIMARY KEY,
  product_id INT,
  rating INT,
  date TEXT,
  summary VARCHAR(255),
  body VARCHAR,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR(63),
  reviewer_email VARCHAR(63),
  response VARCHAR(255),
  helpfulness INT
);
CREATE INDEX review_productid_index ON tempreviews (product_id);

COPY tempreviews FROM '/Users/xiaohan/Desktop/HR/SystemDesignCapstone/originaldata/reviews.csv' DELIMITER ',' CSV HEADER;



-- # Create reviews table

-- CREATE TABLE IF NOT EXISTS reviews AS
--   SELECT id, product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email FROM tempreviews;
-- ALTER TABLE reviews ADD PRIMARY KEY (id);



-- # Create responses table

DROP TABLE IF EXISTS responses;
CREATE TABLE responses AS
  SELECT id AS review_id, response FROM tempreviews;
ALTER TABLE responses ADD id SERIAL;
ALTER TABLE responses ADD PRIMARY KEY (id);
ALTER TABLE responses ADD CONSTRAINT responses_review_id_fkey
  FOREIGN KEY (review_id) REFERENCES tempreviews (id);



-- # Create reviewreported table

DROP TABLE IF EXISTS reviewreported;
CREATE TABLE reviewreported AS
  SELECT id AS review_id, reported FROM tempreviews;
ALTER TABLE reviewreported ADD id SERIAL PRIMARY KEY;
ALTER TABLE reviewreported ADD CONSTRAINT reviewreported_review_id_fkey
  FOREIGN KEY (review_id) REFERENCES tempreviews (id);



-- # Create reviewhelpfulness table

DROP TABLE IF EXISTS reviewhelpfulness;
CREATE TABLE reviewhelpfulness AS
  SELECT id AS review_id, helpfulness FROM tempreviews;
ALTER TABLE reviewhelpfulness ADD id SERIAL PRIMARY KEY;
ALTER TABLE reviewhelpfulness ADD CONSTRAINT reviewhelpfulness_review_id_fkey
  FOREIGN KEY (review_id) REFERENCES tempreviews (id);


-- # Create reviewphotos table

DROP TABLE IF EXISTS reviewphotos;
CREATE TABLE reviewphotos (
  id INT NOT NULL PRIMARY KEY,
  review_id INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  FOREIGN KEY (review_id) REFERENCES tempreviews (id)
);
CREATE INDEX review_id_index ON reviewphotos (review_id);

COPY reviewphotos FROM '/Users/xiaohan/Desktop/HR/SystemDesignCapstone/originaldata/reviews_photos.csv' DELIMITER ',' CSV HEADER;



-- # Create characteristics table for now

DROP TABLE IF EXISTS characteristics;
CREATE TABLE characteristics (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR(15) NOT NULL
);

COPY characteristics FROM '/Users/xiaohan/Desktop/HR/SystemDesignCapstone/originaldata/characteristics.csv' DELIMITER ',' CSV HEADER;

-- # Create characteristics_reviews table for now

DROP TABLE IF EXISTS characteristics_reviews;
CREATE TABLE characteristics_reviews (
  id INT PRIMARY KEY,
  characteristics_id INT NOT NULL,
  review_id INT NOT NULL,
  value INT,
  FOREIGN KEY (characteristics_id) REFERENCES characteristics (id),
  FOREIGN KEY (review_id) REFERENCES tempreviews (id)
);

COPY characteristics_reviews FROM '/Users/xiaohan/Desktop/HR/SystemDesignCapstone/originaldata/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
