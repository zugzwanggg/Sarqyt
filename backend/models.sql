CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE,
  google_id TEXT UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(200),
  address TEXT,
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

CREATE TABLE product_types (
    id SERIAL PRIMARY KEY,
    shop_id INT NOT NULL REFERENCES shops(id),
    title VARCHAR NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE sarqyts (
  id SERIAL PRIMARY KEY,
  product_type_id INT NOT NULL REFERENCES product_types(id),
  original_price DECIMAL,
  discounted_price DECIMAL,
  quantity_available INT,
  pickup_start TIME,
  pickup_end TIME,
  available_until TIMESTAMP,
  rate NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE favorites (
  user_id INT REFERENCES users(id),
  product_type_id INT REFERENCES product_types(id),
  PRIMARY KEY(user_id, product_type_id)
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

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id), 
  sarqyt_id INT NOT NULL REFERENCES sarqyts(id),
  shop_id INT NOT NULL REFERENCES shops(id), 
  quantity INT NOT NULL DEFAULT 1,
  total_price DECIMAL NOT NULL, 
  status VARCHAR(50) NOT NULL DEFAULT 'pending', 
  payment_method VARCHAR(50)
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  pickup_code VARCHAR(10),
  pickup_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  sarqyt_id INT NOT NULL REFERENCES sarqyts(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  collection_experience SMALLINT CHECK (collection_experience BETWEEN 1 AND 5),
  food_quality SMALLINT CHECK (food_quality BETWEEN 1 AND 5),
  variety SMALLINT CHECK (variety BETWEEN 1 AND 5),
  quantity SMALLINT CHECK (quantity BETWEEN 1 AND 5),
  overall_rating SMALLINT CHECK (overall_rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT now()
);