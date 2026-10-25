---
title: The reorder list
kind: problem
difficulty: hard
ordered: true
hints:
  - "Units sold per product over the last 90 days of data: order dates from 2025-10-03 to 2025-12-31."
  - "Days of cover = stock ÷ average daily units sold. Watch out for products with no recent sales."
---
Purchasing reorders products whose stock won't last **30 days** at their recent sales rate. Using orders placed from **2025-10-03 to 2025-12-31** (90 days, excluding cancelled orders), compute each product's average units sold per day. Return the **not discontinued** products with **fewer than 30 days of cover** (stock ÷ daily rate): `product_id`, `stock`, daily rate rounded to 2 decimals, and days of cover rounded to 1 decimal. Fewest days of cover first, ties broken by `product_id`.

```sql solution
WITH recent AS (
  SELECT oi.product_id, sum(oi.quantity) / 90.0 AS daily_rate
  FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
  WHERE o.order_date >= '2025-10-03' AND o.order_date < '2026-01-01' AND o.status <> 'cancelled'
  GROUP BY oi.product_id
)
SELECT p.product_id, p.stock, round(r.daily_rate, 2) AS daily_rate, round(p.stock / r.daily_rate, 1) AS days_of_cover
FROM products p JOIN recent r ON r.product_id = p.product_id
WHERE NOT p.discontinued AND p.stock / r.daily_rate < 30
ORDER BY days_of_cover, p.product_id;
```

```sql wrong
WITH recent AS (
  SELECT oi.product_id, sum(oi.quantity) / 90 AS daily_rate
  FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
  WHERE o.order_date >= '2025-10-03' AND o.order_date < '2026-01-01' AND o.status <> 'cancelled'
  GROUP BY oi.product_id
)
SELECT p.product_id, p.stock, round(r.daily_rate, 2) AS daily_rate, round(p.stock / nullif(r.daily_rate, 0), 1) AS days_of_cover
FROM products p JOIN recent r ON r.product_id = p.product_id
WHERE NOT p.discontinued AND p.stock / nullif(r.daily_rate, 0) < 30
ORDER BY days_of_cover, p.product_id;
```

## Explanation
`sum(quantity) / 90` is **integer division**: most products sell fewer than 90 units in 90 days, so their rate becomes 0 and they drop out. Dividing by `90.0` keeps the fraction.
