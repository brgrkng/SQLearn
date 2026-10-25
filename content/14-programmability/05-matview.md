---
title: A refreshable report
kind: drill
hints:
  - "`CREATE MATERIALIZED VIEW ... AS SELECT ...;` then after changing data, `REFRESH MATERIALIZED VIEW ...;`"
---
Create a materialized view `category_sales` with each `category_id` and its total `units` sold (sum of order line quantities). Then raise the quantity of **order 1's line with the lowest `product_id`** by **1000**, and **refresh** the view so it includes the change.

```sql solution
CREATE MATERIALIZED VIEW category_sales AS
SELECT p.category_id, sum(oi.quantity) AS units
FROM order_items oi JOIN products p ON p.product_id = oi.product_id
GROUP BY p.category_id;
UPDATE order_items SET quantity = quantity + 1000 WHERE order_id = 1 AND product_id = (SELECT min(product_id) FROM order_items WHERE order_id = 1);
REFRESH MATERIALIZED VIEW category_sales;
```

```sql check The report includes the big order
SELECT category_id, units FROM category_sales;
```

```sql check It's a materialized view
SELECT count(*) FROM pg_matviews WHERE matviewname = 'category_sales';
```

```sql wrong
CREATE MATERIALIZED VIEW category_sales AS
SELECT p.category_id, sum(oi.quantity) AS units
FROM order_items oi JOIN products p ON p.product_id = oi.product_id
GROUP BY p.category_id;
UPDATE order_items SET quantity = quantity + 1000 WHERE order_id = 1 AND product_id = (SELECT min(product_id) FROM order_items WHERE order_id = 1);
```
