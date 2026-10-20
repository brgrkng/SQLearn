---
title: Orders in March
kind: drill
hints:
  - "A half-open range: on or after the 1st of March, and before the 1st of April."
---
Return the `order_id`, `customer_id` and `order_date` of every order placed in **March 2025**.

```sql starter
SELECT order_id, customer_id, order_date
FROM orders
WHERE
```

```sql solution
SELECT order_id, customer_id, order_date
FROM orders
WHERE order_date >= '2025-03-01' AND order_date < '2025-04-01';
```

```sql wrong
SELECT order_id, customer_id, order_date
FROM orders
WHERE order_date BETWEEN '2025-03-01' AND '2025-03-30';
```

```sql wrong
SELECT order_id, customer_id, order_date
FROM orders
WHERE order_date > '2025-03-01' AND order_date < '2025-04-01';
```
