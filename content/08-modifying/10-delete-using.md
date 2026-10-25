---
title: Purge old cancellations
kind: drill
hints:
  - Order lines reference orders, so delete the lines first, then the orders.
  - "Two statements: `DELETE FROM order_items ... USING orders ...;` then `DELETE FROM orders ...;`"
---
Completely remove every **cancelled** order placed in **2022**, together with its order lines. Other orders must stay.

```sql solution
DELETE FROM order_items oi
USING orders o
WHERE o.order_id = oi.order_id AND o.status = 'cancelled' AND o.order_date < '2023-01-01';

DELETE FROM orders WHERE status = 'cancelled' AND order_date < '2023-01-01';
```

```sql check No cancelled 2022 orders remain
SELECT count(*) FROM orders WHERE status = 'cancelled' AND order_date < '2023-01-01';
```

```sql check Order totals match
SELECT count(*), sum(order_id) FROM orders;
```

```sql check Order line totals match
SELECT count(*), sum(quantity) FROM order_items;
```

```sql wrong
DELETE FROM order_items oi
USING orders o
WHERE o.order_id = oi.order_id AND o.status = 'cancelled' AND o.order_date < '2023-01-01';
```
