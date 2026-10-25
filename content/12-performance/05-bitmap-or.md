---
title: Either condition
kind: drill
costSlack: 10
hints:
  - "`order_date` already has an index. The other side of the `OR` doesn't."
  - With an index for each condition, PostgreSQL can combine them with a BitmapOr.
---
This query reads the whole table because only one side of the `OR` is indexed. Add what's missing.

```sql norun
SELECT order_id FROM orders WHERE customer_id = 42 OR order_date = '2025-06-01';
```

```sql solution
CREATE INDEX orders_customer_id_idx ON orders (customer_id);
```

```sql explain
SELECT order_id FROM orders WHERE customer_id = 42 OR order_date = '2025-06-01';
```

```sql wrong
CREATE INDEX orders_date_customer_idx ON orders (order_date, customer_id);
```
