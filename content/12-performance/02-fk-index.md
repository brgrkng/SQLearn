---
title: Index the foreign key
kind: drill
costSlack: 10
hints:
  - "`CREATE INDEX ... ON orders (customer_id);`"
---
The customer account page runs this query, and it scans all of `orders` every time:

```sql norun
SELECT order_id, order_date FROM orders WHERE customer_id = 42;
```

Create an index that makes it fast. You're graded on that query's estimated cost after your SQL runs.

```sql starter
CREATE INDEX
```

```sql solution
CREATE INDEX orders_customer_id_idx ON orders (customer_id);
```

```sql explain
SELECT order_id, order_date FROM orders WHERE customer_id = 42;
```

```sql wrong
CREATE INDEX orders_order_id_idx ON orders (order_id, customer_id);
```
