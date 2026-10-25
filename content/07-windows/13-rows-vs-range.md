---
title: Numbering within a day
kind: drill
ordered: true
hints:
  - "With `ORDER BY order_date` only, every order on the same day is a peer under the default RANGE frame."
  - "Order by `order_date, order_id` and use a `ROWS` frame (or `row_number()`)."
---
For orders placed **2025-01-01 to 2025-01-03**, return `order_id`, `order_date`, and a **running count of orders** that increases by exactly 1 on every row, ordered by date and then `order_id`.

```sql starter
SELECT order_id, order_date, count(*) OVER (ORDER BY order_date) AS running_count
FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-01-03'
ORDER BY order_date, order_id;
```

```sql solution
SELECT order_id, order_date,
       count(*) OVER (ORDER BY order_date, order_id ROWS UNBOUNDED PRECEDING) AS running_count
FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-01-03'
ORDER BY order_date, order_id;
```
