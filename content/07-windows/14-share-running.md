---
title: Cumulative share
kind: drill
ordered: true
hints:
  - "Running sum of units divided by the total: `sum(units) OVER (ORDER BY units DESC, product_id) / sum(units) OVER ()`."
---
This is a Pareto check. Rank products by total units sold (most first, ties by `product_id`) and return the top **20**: `product_id`, units, and the **cumulative percentage** of all units sold that the products so far account for, rounded to 2 decimals.

```sql solution
WITH units AS (
  SELECT product_id, sum(quantity) AS units FROM order_items GROUP BY product_id
)
SELECT product_id, units,
       round(100.0 * sum(units) OVER (ORDER BY units DESC, product_id) / sum(units) OVER (), 2) AS cumulative_pct
FROM units
ORDER BY units DESC, product_id
LIMIT 20;
```

```sql wrong
WITH units AS (
  SELECT product_id, sum(quantity) AS units FROM order_items GROUP BY product_id
)
SELECT product_id, units,
       round(100.0 * units / sum(units) OVER (), 2) AS cumulative_pct
FROM units
ORDER BY units DESC, product_id
LIMIT 20;
```
