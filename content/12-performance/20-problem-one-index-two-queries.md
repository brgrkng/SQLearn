---
title: One index, two queries
kind: problem
difficulty: hard
costSlack: 10
hints:
  - "An index on `(a, b)` also serves queries on `a` alone. The leftmost prefix rule."
  - The dashboard's busiest query is graded. Make sure the other one would be served too.
---
Two dashboard queries run thousands of times a day:

```sql norun
-- Q1: a customer's order count by status
SELECT status, count(*) FROM orders WHERE customer_id = 42 GROUP BY status;
-- Q2: a customer's orders in a date range
SELECT order_id FROM orders WHERE customer_id = 42 AND order_date >= '2025-01-01';
```

You may create **only one index**. Choose it so **Q2** (the one graded) is as cheap as possible, while Q1 can also use it.

```sql solution
CREATE INDEX orders_customer_date_idx ON orders (customer_id, order_date);
```

```sql explain
SELECT order_id FROM orders WHERE customer_id = 42 AND order_date >= '2025-01-01';
```

```sql check Q1 can use the index too
SELECT count(*) > 0 FROM pg_indexes WHERE tablename = 'orders' AND indexdef LIKE '%(customer_id%';
```

```sql wrong
CREATE INDEX orders_date_customer_idx ON orders (order_date, customer_id);
```
