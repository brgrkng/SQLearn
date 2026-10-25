-- Shop: an online store. Big enough (50k orders, ~125k order items) that
-- query plans and costs are realistic. Data is generated deterministically.
SELECT setseed(0.42);

CREATE TABLE categories (
  category_id int PRIMARY KEY,
  name        text NOT NULL UNIQUE,
  parent_id   int REFERENCES categories
);

CREATE TABLE products (
  product_id   int PRIMARY KEY,
  name         text NOT NULL,
  category_id  int NOT NULL REFERENCES categories,
  price        numeric(10,2) NOT NULL CHECK (price >= 0),
  stock        int NOT NULL CHECK (stock >= 0),
  discontinued boolean NOT NULL DEFAULT false,
  added_on     date NOT NULL
);

CREATE TABLE customers (
  customer_id  int PRIMARY KEY,
  first_name   text NOT NULL,
  last_name    text NOT NULL,
  email        text UNIQUE,
  city         text,
  country      text NOT NULL,
  signup_date  date NOT NULL,
  loyalty_tier text CHECK (loyalty_tier IN ('silver', 'gold', 'platinum'))
);

CREATE TABLE orders (
  order_id     int PRIMARY KEY,
  customer_id  int NOT NULL REFERENCES customers,
  order_date   date NOT NULL,
  status       text NOT NULL CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled', 'returned')),
  shipped_date date
);

CREATE TABLE order_items (
  order_id   int NOT NULL REFERENCES orders,
  product_id int NOT NULL REFERENCES products,
  quantity   int NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

INSERT INTO categories VALUES
  (1, 'Electronics', NULL), (2, 'Home & Kitchen', NULL), (3, 'Books', NULL),
  (4, 'Sports & Outdoors', NULL), (5, 'Clothing', NULL), (6, 'Toys & Games', NULL),
  (7, 'Audio', 1), (8, 'Computers', 1), (9, 'Phones', 1), (10, 'Cameras', 1),
  (11, 'Kitchen', 2), (12, 'Furniture', 2), (13, 'Garden', 2),
  (14, 'Fiction', 3), (15, 'Non-fiction', 3), (16, 'Children''s Books', 3),
  (17, 'Fitness', 4), (18, 'Camping', 4), (19, 'Cycling', 4),
  (20, 'Menswear', 5), (21, 'Womenswear', 5), (22, 'Shoes', 5),
  (23, 'Board Games', 6), (24, 'Puzzles', 6),
  (25, 'Headphones', 7), (26, 'Laptops', 8);

INSERT INTO products
SELECT row_number() OVER (ORDER BY category_id, noun, brand),
       brand || ' ' || noun,
       category_id,
       round(base_price * mult) - 0.01,
       CASE WHEN x < 0.07 OR (x > 0.93 AND y < 0.35) THEN 0 ELSE floor(y * 250)::int END,
       x > 0.93,
       date '2020-01-01' + floor(z * 1800)::int
FROM (
-- random() in a subquery's select list runs once per row, in this ORDER BY.
SELECT n.*, b.*, random() AS x, random() AS y, random() AS z
FROM (VALUES
  (25, 'Over-Ear Headphones', 149), (25, 'Earbuds', 49), (7, 'Bluetooth Speaker', 59), (7, 'Soundbar', 199),
  (26, 'Laptop', 999), (26, 'Ultrabook', 1299), (8, 'Monitor', 249), (8, 'Keyboard', 69), (8, 'Mouse', 29), (8, 'USB-C Hub', 39),
  (9, 'Smartphone', 699), (9, 'Phone Case', 19), (9, 'Charger', 25),
  (10, 'Mirrorless Camera', 1199), (10, 'Tripod', 45), (10, 'Zoom Lens', 499),
  (11, 'Blender', 79), (11, 'Chef''s Knife', 59), (11, 'Frying Pan', 39), (11, 'Coffee Maker', 129),
  (12, 'Desk', 299), (12, 'Office Chair', 249), (12, 'Bookshelf', 149), (12, 'Floor Lamp', 49),
  (13, 'Garden Hose', 35), (13, 'Pruning Shears', 22), (13, 'Planter', 18),
  (14, 'Mystery Novel', 16), (14, 'Thriller', 14), (14, 'Fantasy Saga', 24),
  (15, 'Cookbook', 29), (15, 'Biography', 22), (15, 'History of Science', 27),
  (16, 'Picture Book', 12), (16, 'Activity Book', 9),
  (17, 'Yoga Mat', 35), (17, 'Dumbbell Set', 89), (17, 'Resistance Bands', 19),
  (18, 'Tent', 229), (18, 'Sleeping Bag', 99), (18, 'Headlamp', 29),
  (19, 'Bike Helmet', 59), (19, 'Bike Light', 25), (19, 'Water Bottle', 12),
  (20, 'T-Shirt', 19), (20, 'Jeans', 59), (20, 'Rain Jacket', 129),
  (21, 'Dress', 69), (21, 'Sweater', 49), (21, 'Scarf', 25),
  (22, 'Running Shoes', 109), (22, 'Hiking Boots', 139), (22, 'Sandals', 39),
  (23, 'Strategy Game', 45), (23, 'Party Game', 25),
  (24, '1000-Piece Puzzle', 19), (24, '3D Puzzle', 29)
) AS n(category_id, noun, base_price)
CROSS JOIN (VALUES
  ('Acme', 1.0), ('Nova', 1.15), ('Orbit', 0.85), ('Summit', 1.3),
  ('Basic', 0.6), ('Zenith', 1.5), ('Pioneer', 0.95), ('Lumen', 1.1)
) AS b(brand, mult)
ORDER BY n.category_id, n.noun, b.brand
) s;

INSERT INTO customers
SELECT i,
       f.names[1 + floor(r.a * array_length(f.names, 1))::int],
       l.names[1 + floor(r.b * array_length(l.names, 1))::int],
       NULL, -- filled below
       CASE WHEN r.c < 0.03 THEN NULL ELSE p.cities[1 + floor(r.d * array_length(p.cities, 1))::int] END,
       p.countries[1 + floor(r.d * array_length(p.cities, 1))::int],
       date '2020-06-01' + floor(r.e * 1300)::int,
       CASE WHEN r.f < 0.60 THEN NULL WHEN r.f < 0.85 THEN 'silver' WHEN r.f < 0.97 THEN 'gold' ELSE 'platinum' END
FROM generate_series(1, 5000) AS i
CROSS JOIN (SELECT ARRAY['James','Mary','Liam','Olivia','Noah','Emma','Ava','Lucas','Mia','Ethan','Sofia','Mateo',
  'Amara','Kenji','Priya','Omar','Fatima','Chen','Aisha','Diego','Elena','Ivan','Leila','Hiro','Zara','Kofi','Nina',
  'Ravi','Sara','Tomas','Yuki','Ana','Ben','Chloe','Daniel','Grace','Hugo','Isla','Jack','Maya']) AS f(names)
CROSS JOIN (SELECT ARRAY['Smith','Garcia','Kim','Patel','Nguyen','Müller','Rossi','Silva','Okafor','Tanaka','Cohen',
  'Novak','Hansen','Dubois','Kowalski','Haddad','Mensah','Ivanova','Lopez','Brown','Wilson','Khan','Sato','Jensen',
  'Murphy','Costa','Ali','Schmidt','Moreau','Larsen']) AS l(names)
CROSS JOIN (SELECT
  ARRAY['New York','Chicago','Austin','Seattle','Toronto','Vancouver','London','Manchester','Berlin','Munich',
        'Paris','Lyon','Madrid','Barcelona','Rome','Milan','Tokyo','Osaka','Sydney','Melbourne','São Paulo','Mumbai','Lagos','Nairobi'],
  ARRAY['USA','USA','USA','USA','Canada','Canada','UK','UK','Germany','Germany',
        'France','France','Spain','Spain','Italy','Italy','Japan','Japan','Australia','Australia','Brazil','India','Nigeria','Kenya']
) AS p(cities, countries)
CROSS JOIN LATERAL (SELECT random() + 0 * i AS a, random() AS b, random() AS c, random() AS d, random() AS e, random() AS f) r;

UPDATE customers
SET email = lower(translate(first_name || '.' || last_name, 'üãé', 'uae')) || customer_id || '@example.com'
WHERE random() > 0.04;

INSERT INTO orders
SELECT row_number() OVER (ORDER BY g.order_date, g.customer_id, g.i),
       g.customer_id, g.order_date,
       CASE WHEN g.s < 0.06 THEN 'cancelled'
            WHEN g.s < 0.10 THEN 'returned'
            WHEN g.order_date > date '2025-12-24' THEN CASE WHEN g.s < 0.55 THEN 'pending' ELSE 'shipped' END
            ELSE 'delivered' END,
       CASE WHEN g.s < 0.06 OR (g.order_date > date '2025-12-24' AND g.s < 0.55) THEN NULL
            ELSE g.order_date + 1 + floor(g.t * 5)::int END
FROM (
  SELECT x.i, c.customer_id,
         greatest(c.signup_date, date '2022-01-01')
           + floor(x.d * (date '2025-12-31' - greatest(c.signup_date, date '2022-01-01')))::int AS order_date,
         x.s, x.t
  FROM generate_series(1, 50000) AS i
  CROSS JOIN LATERAL (SELECT i, 1 + floor(power(random(), 2.5) * 5000)::int AS cid,
                             random() AS d, random() AS s, random() AS t) x
  JOIN customers c ON c.customer_id = x.cid
) g;

INSERT INTO order_items
SELECT o.order_id, p.product_id,
       1 + floor(power(random(), 3) * 5)::int,
       CASE WHEN random() < 0.15 THEN round(p.price * 0.9, 2) ELSE p.price END
FROM orders o
CROSS JOIN LATERAL (
  SELECT DISTINCT 1 + floor(random() * (SELECT count(*) FROM products))::int + 0 * o.order_id AS product_id
  FROM generate_series(1, 1 + floor(random() * 4)::int + 0 * o.order_id)
) pick
JOIN products p ON p.product_id = pick.product_id;

-- Orders are routinely looked up by date.
CREATE INDEX orders_order_date_idx ON orders (order_date);
