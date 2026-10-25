---
title: Non-overlapping price periods
kind: problem
difficulty: hard
dataset: empty
hints:
  - A `daterange` column holds the validity period.
  - "`EXCLUDE USING gist (product_id WITH =, valid WITH &&)` needs `btree_gist`."
---
Create `price_periods` with `product_id` (required `int`), `price` (required `numeric(10,2)`, positive) and `valid` (required `daterange`). A product can have many price periods over time, but **they must never overlap**, so there's never any doubt which price applies on a given day.

```sql solution
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE price_periods (
  product_id int NOT NULL,
  price      numeric(10,2) NOT NULL CHECK (price > 0),
  valid      daterange NOT NULL,
  EXCLUDE USING gist (product_id WITH =, valid WITH &&)
);
```

```sql check Consecutive periods are fine
INSERT INTO price_periods VALUES (1, 9.99, '[2026-01-01, 2026-02-01)'), (1, 10.99, '[2026-02-01, 2026-03-01)'), (2, 5.00, '[2026-01-01, 2026-03-01)')
RETURNING product_id;
```

```sql check Overlapping periods are rejected
INSERT INTO price_periods VALUES (3, 1.00, '[2026-01-01, 2026-02-01)'), (3, 2.00, '[2026-01-15, 2026-02-15)');
```

```sql check Prices must be positive
INSERT INTO price_periods VALUES (4, 0, '[2026-01-01, 2026-02-01)');
```

```sql check The price on a given day
INSERT INTO price_periods VALUES (5, 3.00, '[2026-01-01, 2026-02-01)'), (5, 4.00, '[2026-02-01, 2026-03-01)');
SELECT price FROM price_periods WHERE product_id = 5 AND valid @> date '2026-02-14';
```

```sql wrong
CREATE TABLE price_periods (
  product_id int NOT NULL,
  price      numeric(10,2) NOT NULL CHECK (price > 0),
  valid      daterange NOT NULL,
  PRIMARY KEY (product_id, valid)
);
```
