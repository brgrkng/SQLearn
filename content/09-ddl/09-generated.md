---
title: A computed total
kind: drill
dataset: empty
hints:
  - "`line_total numeric(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED`"
---
Create `order_lines` with `line_id` (always-generated identity, primary key), `quantity` (required `int`), `unit_price` (required `numeric(10,2)`) and `line_total` (`numeric(12,2)`), which the database **computes** as quantity × unit price and keeps up to date.

```sql solution
CREATE TABLE order_lines (
  line_id    int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quantity   int NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  line_total numeric(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);
```

```sql check Totals are computed
INSERT INTO order_lines (quantity, unit_price) VALUES (3, 9.99), (10, 1.25) RETURNING line_total;
```

```sql check Totals follow updates
INSERT INTO order_lines (quantity, unit_price) VALUES (1, 5.00);
UPDATE order_lines SET quantity = 4;
SELECT line_total FROM order_lines;
```

```sql check The total can't be written directly
INSERT INTO order_lines (quantity, unit_price, line_total) VALUES (1, 1.00, 999);
```

```sql wrong
CREATE TABLE order_lines (
  line_id    int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quantity   int NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  line_total numeric(12,2)
);
```
