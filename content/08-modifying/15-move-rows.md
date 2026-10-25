---
title: Move, don't copy
kind: drill
hints:
  - "`WITH moved AS (DELETE FROM ... RETURNING *) INSERT INTO archive SELECT * FROM moved`"
---
The setup creates an empty `archived_orders` table with the same columns as `orders`. In **one statement**, move every order that is **cancelled** and was placed **before 2023** out of `orders` and into `archived_orders`. These orders have no order lines left (the setup removed them).

```sql setup
DELETE FROM order_items oi USING orders o
WHERE o.order_id = oi.order_id AND o.status = 'cancelled' AND o.order_date < '2023-01-01';
CREATE TABLE archived_orders (LIKE orders);
```

```sql solution
WITH moved AS (
  DELETE FROM orders WHERE status = 'cancelled' AND order_date < '2023-01-01'
  RETURNING *
)
INSERT INTO archived_orders SELECT * FROM moved;
```

```sql check The archive holds the moved orders
SELECT order_id, customer_id, order_date, status FROM archived_orders;
```

```sql check They're gone from orders
SELECT count(*) FROM orders WHERE status = 'cancelled' AND order_date < '2023-01-01';
```

```sql wrong
INSERT INTO archived_orders
SELECT * FROM orders WHERE status = 'cancelled' AND order_date < '2023-01-01';
```
