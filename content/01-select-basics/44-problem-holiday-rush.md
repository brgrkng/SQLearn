---
title: Holiday rush
kind: problem
difficulty: medium
---
Return the `order_id` and `order_date` of every order placed between **20 and 31 December (inclusive)** in **2023 or 2024**.

```sql solution
SELECT order_id, order_date
FROM orders
WHERE (order_date >= '2023-12-20' AND order_date < '2024-01-01')
   OR (order_date >= '2024-12-20' AND order_date < '2025-01-01');
```

```sql wrong
SELECT order_id, order_date
FROM orders
WHERE order_date >= '2023-12-20' AND order_date < '2025-01-01';
```

```sql wrong
SELECT order_id, order_date
FROM orders
WHERE order_date BETWEEN '2023-12-20' AND '2023-12-30'
   OR order_date BETWEEN '2024-12-20' AND '2024-12-30';
```
