---
title: Days between orders
kind: drill
ordered: true
hints:
  - "`order_date - lag(order_date) OVER (ORDER BY order_date, order_id)`"
---
For **customer 42**, return each `order_id`, its `order_date`, and the number of **days since the customer's previous order** (NULL for their first). Sort by date, then `order_id`.

```sql solution
SELECT order_id, order_date,
       order_date - lag(order_date) OVER (ORDER BY order_date, order_id) AS days_since_previous
FROM orders
WHERE customer_id = 42
ORDER BY order_date, order_id;
```

```sql wrong
SELECT order_id, order_date,
       order_date - lag(order_date) OVER (ORDER BY order_id DESC) AS days_since_previous
FROM orders
WHERE customer_id = 42
ORDER BY order_date, order_id;
```
