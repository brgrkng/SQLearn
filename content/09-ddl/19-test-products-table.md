---
title: Product catalogue table
kind: test
dataset: empty
---
Create `items` with: `item_id` (always-generated identity primary key), `sku` (required `text`), `price` (required, exact, up to 99,999,999.99), `weight_kg` (optional `double precision`), `active` (required `boolean`, default true), and `price_with_tax` (`numeric(12,2)`), a stored generated column equal to price × 1.2.

```sql solution
CREATE TABLE items (
  item_id        int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku            text NOT NULL,
  price          numeric(10,2) NOT NULL,
  weight_kg      double precision,
  active         boolean NOT NULL DEFAULT true,
  price_with_tax numeric(12,2) GENERATED ALWAYS AS (price * 1.2) STORED
);
```

```sql check Generated price and defaults
INSERT INTO items (sku, price, weight_kg) VALUES ('A-1', 10.00, 0.5), ('B-2', 99999999.99, NULL)
RETURNING item_id, price_with_tax, active;
```

```sql check Prices beyond the limit are rejected
INSERT INTO items (sku, price) VALUES ('C-3', 100000000.00);
```

```sql check Column types
SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'items';
```

```sql wrong
CREATE TABLE items (
  item_id        int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku            text NOT NULL,
  price          numeric NOT NULL,
  weight_kg      double precision,
  active         boolean NOT NULL DEFAULT true,
  price_with_tax numeric(12,2) GENERATED ALWAYS AS (price * 1.2) STORED
);
```
