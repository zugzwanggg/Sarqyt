CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  google_id TEXT UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(200),
  password TEXT,
  role VARCHAR DEFAULT 'user',
  country INT REFERENCES countries(id),
  city INT REFERENCES cities(id),
  agreement_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  code VARCHAR,
  phone_code VARCHAR
);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNQIUE NOT NULL,
  country_id INT REFERENCES countries(id)
);

CREATE TABLE shops (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  image_url TEXT,
  description TEXT,
  address TEXT,
  link TEXT,
  city INT REFERENCES cities(id),
  country INT REFERENCES countries(id),
  lat DECIMAL,
  lng DECIMAL,
  user_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sarqyts (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER REFERENCES shops(id),
  title VARCHAR,
  description TEXT,
  original_price DECIMAL,
  discounted_price DECIMAL,
  quantity_available INTEGER,
  pickup_start TIME,
  pickup_end TIME,
  available_until TIMESTAMP,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE favorites (
  user_id INTEGER REFERENCES users(id),
  sarqyt_id INTEGER REFERENCES sarqyts(id),
  PRIMARY KEY (user_id, sarqyt_id)
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE sarqyt_category (
  category_id INT REFERENCES categories(id),
  sarqyt_id INT REFERENCES sarqyts(id),
  PRIMARY KEY(category_id, item_id)
);