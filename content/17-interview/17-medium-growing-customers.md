---
title: Growing every year
kind: problem
difficulty: medium
ordered: true
hints:
  - "Pivot each customer's yearly order counts into columns with `count(*) FILTER (WHERE ...)`."
---
Find customers whose number of orders **strictly increased** every year from **2023** to **2024** to **2025**, and who ordered at least once in 2023. Return `customer_id` and the three yearly counts. Sort by `customer_id`.

```sql solution
WITH yearly AS (
  SELECT customer_id,
         count(*) FILTER (WHERE order_date >= '2023-01-01' AND order_date < '2024-01-01') AS y2023,
         count(*) FILTER (WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01') AS y2024,
         count(*) FILTER (WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01') AS y2025
  FROM orders
  GROUP BY customer_id
)
SELECT customer_id, y2023, y2024, y2025
FROM yearly
WHERE y2023 > 0 AND y2023 < y2024 AND y2024 < y2025
ORDER BY customer_id;
```

```sql wrong
WITH yearly AS (
  SELECT customer_id,
         count(*) FILTER (WHERE order_date >= '2023-01-01' AND order_date < '2024-01-01') AS y2023,
         count(*) FILTER (WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01') AS y2024,
         count(*) FILTER (WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01') AS y2025
  FROM orders
  GROUP BY customer_id
)
SELECT customer_id, y2023, y2024, y2025
FROM yearly
WHERE y2023 > 0 AND y2023 <= y2024 AND y2024 <= y2025
ORDER BY customer_id;
```
