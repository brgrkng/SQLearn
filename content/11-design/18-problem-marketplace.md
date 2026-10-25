---
title: A two-sided marketplace
kind: problem
difficulty: hard
dataset: empty
hints:
  - Buyers and sellers are both users, so one `users` table with two foreign keys pointing at it from `orders`.
  - "A CHECK can compare two columns of the same row: `buyer_id <> seller_id`."
---
Design a marketplace where any user can both **buy and sell**:

- `users(user_id, username)`: usernames are unique
- `listings(listing_id, seller_id, title, price)`: the seller is a user, and price is positive
- `orders(order_id, listing_id, seller_id, buyer_id, ordered_at)`: the order records the listing's seller, which **must match** the listing. The buyer is a user, a listing can be ordered **at most once**, and **nobody can buy their own listing**.

All columns are required. Ids are integers.

```sql solution
CREATE TABLE users (user_id int PRIMARY KEY, username text NOT NULL UNIQUE);
CREATE TABLE listings (
  listing_id int PRIMARY KEY,
  seller_id  int NOT NULL REFERENCES users,
  title      text NOT NULL,
  price      numeric(10,2) NOT NULL CHECK (price > 0),
  UNIQUE (listing_id, seller_id)
);
CREATE TABLE orders (
  order_id   int PRIMARY KEY,
  listing_id int NOT NULL UNIQUE,
  seller_id  int NOT NULL,
  buyer_id   int NOT NULL REFERENCES users,
  ordered_at timestamptz NOT NULL,
  FOREIGN KEY (listing_id, seller_id) REFERENCES listings (listing_id, seller_id),
  CHECK (buyer_id <> seller_id)
);
```

```sql check Normal buying and selling
INSERT INTO users VALUES (1, 'ada'), (2, 'alan');
INSERT INTO listings VALUES (10, 1, 'Old laptop', 200), (11, 2, 'Bike', 90);
INSERT INTO orders (order_id, listing_id, seller_id, buyer_id, ordered_at)
VALUES (100, 10, 1, 2, '2026-01-01 10:00+00'), (101, 11, 2, 1, '2026-01-02 10:00+00');
SELECT count(*) FROM orders;
```

```sql check A listing sells only once
INSERT INTO users VALUES (3, 'grace'), (4, 'linus');
INSERT INTO listings VALUES (12, 3, 'Lamp', 15);
INSERT INTO orders (order_id, listing_id, seller_id, buyer_id, ordered_at)
VALUES (102, 12, 3, 4, now()), (103, 12, 3, 4, now());
```

```sql check No buying your own listing
INSERT INTO users VALUES (5, 'edsger');
INSERT INTO listings VALUES (13, 5, 'Desk', 60);
INSERT INTO orders (order_id, listing_id, seller_id, buyer_id, ordered_at) VALUES (104, 13, 5, 5, now());
```

```sql check The seller on the order must be the listing's seller
INSERT INTO users VALUES (6, 'barbara'), (7, 'ken');
INSERT INTO listings VALUES (14, 6, 'Chair', 25);
INSERT INTO orders (order_id, listing_id, seller_id, buyer_id, ordered_at) VALUES (105, 14, 7, 6, now());
```

```sql wrong
CREATE TABLE users (user_id int PRIMARY KEY, username text NOT NULL UNIQUE);
CREATE TABLE listings (listing_id int PRIMARY KEY, seller_id int NOT NULL REFERENCES users, title text NOT NULL, price numeric(10,2) NOT NULL CHECK (price > 0));
CREATE TABLE orders (
  order_id int PRIMARY KEY, listing_id int NOT NULL UNIQUE REFERENCES listings, seller_id int NOT NULL,
  buyer_id int NOT NULL REFERENCES users, ordered_at timestamptz NOT NULL, CHECK (buyer_id <> seller_id)
);
```

## Explanation
"No buying your own listing" compares the buyer with the **listing's** seller, which lives in another table, and a CHECK can only see its own row. The trick is to copy `seller_id` onto the order and use a **composite foreign key** `(listing_id, seller_id)` so the copy is guaranteed to match the listing. Then a plain CHECK can compare `buyer_id` with `seller_id`. The `UNIQUE (listing_id, seller_id)` on `listings` exists so the composite foreign key has something to reference.
