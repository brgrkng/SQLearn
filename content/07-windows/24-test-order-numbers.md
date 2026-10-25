---
title: Order sequence numbers
kind: test
ordered: true
---
For customers **1 to 3**, return each order's `customer_id`, `order_id`, `order_date`, and its **sequence number** for that customer (1 for their first order, 2 for the second, …, ordered by date then `order_id`). Sort by customer, then sequence number.

```sql solution
SELECT customer_id, order_id, order_date,
       row_number() OVER (PARTITION BY customer_id ORDER BY order_date, order_id) AS seq
FROM orders
WHERE customer_id <= 3
ORDER BY customer_id, seq;
```

```sql wrong
SELECT customer_id, order_id, order_date,
       row_number() OVER (ORDER BY order_date, order_id) AS seq
FROM orders
WHERE customer_id <= 3
ORDER BY customer_id, seq;
```
