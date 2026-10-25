---
title: A week of orders, fast
kind: drill
hints:
  - "`orders.order_date` has an index, but not on `date_trunc('week', order_date)`."
  - Rewrite the filter as a half-open range on the bare column.
---
This report lists orders from the ISO week starting **Monday 4 March 2024**. It returns the right rows, but it can't use the index on `order_date`. Make it efficient.

```sql starter
SELECT order_id, order_date, status
FROM orders
WHERE date_trunc('week', order_date) = '2024-03-04';
```

```sql solution
SELECT order_id, order_date, status
FROM orders
WHERE order_date >= '2024-03-04' AND order_date < '2024-03-11';
```

```sql wrong
SELECT order_id, order_date, status
FROM orders
WHERE extract(week FROM order_date) = 10 AND extract(isoyear FROM order_date) = 2024;
```

```sql wrong
SELECT order_id, order_date, status
FROM orders
WHERE order_date >= '2024-03-04' AND order_date <= '2024-03-11';
```
