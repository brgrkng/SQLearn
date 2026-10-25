---
title: Loyal customers this year
kind: drill
ordered: true
hints:
  - The "more than 30" threshold is about **all** of a customer's orders, so you can't filter rows to 2025 in `WHERE`.
  - "Count the 2025 orders with `count(*) FILTER (WHERE ...)`."
---
For customers with **more than 30 orders in total**, return `customer_id`, their total number of orders, and how many of those orders were placed in **2025**. Sort by `customer_id`.

```sql starter
SELECT customer_id, count(*) AS orders_2025
FROM orders
WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
GROUP BY customer_id
HAVING count(*) > 30
ORDER BY customer_id;
```

```sql solution
SELECT customer_id, count(*) AS total_orders,
       count(*) FILTER (WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01') AS orders_2025
FROM orders
GROUP BY customer_id
HAVING count(*) > 30
ORDER BY customer_id;
```

## Explanation
The starter filters to 2025 *before* grouping, so the threshold applies to 2025 orders only and loyal customers with a quieter 2025 vanish. Keep every order in the group, apply the threshold in `HAVING`, and count the 2025 subset with `FILTER`.
