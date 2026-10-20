---
title: A range of orders
kind: test
---
Customer support needs orders **30000 through 30010** (inclusive): their `order_id`, `order_date` and `status`. The query has to be efficient.

```sql solution
SELECT order_id, order_date, status
FROM orders
WHERE order_id BETWEEN 30000 AND 30010;
```

```sql wrong
SELECT order_id, order_date, status
FROM orders
WHERE order_id::text BETWEEN '30000' AND '30010';
```

```sql wrong
SELECT order_id, order_date, status
FROM orders
WHERE order_id - 30000 BETWEEN 0 AND 10;
```

```sql wrong
SELECT order_id, order_date, status
FROM orders
WHERE order_id > 30000 AND order_id < 30010;
```
