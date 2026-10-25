---
title: Latest orders, no sort
kind: drill
costSlack: 10
hints:
  - "An index on `(customer_id, order_date)` is already sorted by date within each customer."
---
The account page shows a customer's three most recent orders. Create an index that serves it without sorting.

```sql norun
SELECT order_id, order_date FROM orders WHERE customer_id = 42 ORDER BY order_date DESC LIMIT 3;
```

```sql solution
CREATE INDEX orders_customer_date_idx ON orders (customer_id, order_date);
```

```sql explain
SELECT order_id, order_date FROM orders WHERE customer_id = 42 ORDER BY order_date DESC LIMIT 3;
```

```sql wrong
CREATE INDEX orders_customer_idx ON orders (customer_id);
```
