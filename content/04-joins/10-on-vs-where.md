---
title: 2025 orders for every Kenyan customer
kind: drill
ordered: true
hints:
  - The date condition is about the right-hand table. Where does it belong in a LEFT JOIN?
---
Return **every** customer in **Kenya** (`customer_id`) with the number of orders they placed in **2025**, showing 0 for customers with no 2025 orders. Sort by `customer_id`.

```sql starter
SELECT c.customer_id, count(o.order_id) AS orders_2025
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE c.country = 'Kenya' AND o.order_date >= '2025-01-01' AND o.order_date < '2026-01-01'
GROUP BY c.customer_id
ORDER BY c.customer_id;
```

```sql solution
SELECT c.customer_id, count(o.order_id) AS orders_2025
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
                  AND o.order_date >= '2025-01-01' AND o.order_date < '2026-01-01'
WHERE c.country = 'Kenya'
GROUP BY c.customer_id
ORDER BY c.customer_id;
```

## Explanation
In the starter, `WHERE o.order_date >= ...` is false (NULL, really) for the padded rows of customers with no 2025 orders, so the WHERE clause removes exactly the customers the LEFT JOIN was meant to keep. Moving the date condition into `ON` makes it part of the match. The country condition is about the left table, so it stays in `WHERE`.
