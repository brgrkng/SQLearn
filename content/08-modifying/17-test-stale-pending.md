---
title: Cancel stale orders
kind: test
---
Orders still **pending** that were placed **before 2025-12-27** are considered abandoned. Set their status to **`cancelled`**, and return the `order_id` of every order you changed.

```sql solution
UPDATE orders SET status = 'cancelled'
WHERE status = 'pending' AND order_date < '2025-12-27'
RETURNING order_id;
```

```sql wrong
UPDATE orders SET status = 'cancelled'
WHERE status = 'pending' AND order_date <= '2025-12-27'
RETURNING order_id;
```
