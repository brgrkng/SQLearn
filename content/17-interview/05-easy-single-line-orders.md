---
title: Single-item orders
kind: problem
difficulty: easy
---
What **percentage of orders** contain exactly **one** order line? Return a single number rounded to 1 decimal place.

```sql solution
WITH lines AS (
  SELECT order_id, count(*) AS n FROM order_items GROUP BY order_id
)
SELECT round(100.0 * count(*) FILTER (WHERE n = 1) / count(*), 1) AS pct_single_line
FROM lines;
```

```sql wrong
WITH lines AS (
  SELECT order_id, sum(quantity) AS n FROM order_items GROUP BY order_id
)
SELECT round(100.0 * count(*) FILTER (WHERE n = 1) / count(*), 1) AS pct_single_line
FROM lines;
```
