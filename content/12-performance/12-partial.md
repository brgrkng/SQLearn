---
title: A queue index
kind: drill
hints:
  - Only about 100 of 50,000 orders are pending. Index just those.
  - "`CREATE INDEX ... ON orders (order_date) WHERE status = 'pending';`"
---
The dispatch screen lists pending orders oldest first. Make it fast with the **smallest** index that does the job.

```sql norun
SELECT order_id, order_date FROM orders WHERE status = 'pending' ORDER BY order_date;
```

```sql solution
CREATE INDEX orders_pending_idx ON orders (order_date) WHERE status = 'pending';
```

```sql explain
SELECT order_id, order_date FROM orders WHERE status = 'pending' ORDER BY order_date;
```

```sql wrong
CREATE INDEX orders_status_idx ON orders (status);
```
