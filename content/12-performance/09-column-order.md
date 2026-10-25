---
title: Column order
kind: drill
costSlack: 10
hints:
  - Equality columns first, then the range column.
---
Create **one** index that makes this query cheap:

```sql norun
SELECT count(*) FROM orders WHERE status = 'cancelled' AND order_date >= '2025-01-01';
```

```sql solution
CREATE INDEX orders_status_date_idx ON orders (status, order_date);
```

```sql explain
SELECT count(*) FROM orders WHERE status = 'cancelled' AND order_date >= '2025-01-01';
```

```sql wrong
CREATE INDEX orders_date_status_idx ON orders (order_date, status);
```

```sql wrong
CREATE INDEX orders_status_idx ON orders (status);
```

## Explanation
With `(status, order_date)`, all cancelled orders sit together in the index, sorted by date, so PostgreSQL jumps to "cancelled, 2025-01-01" and reads a contiguous run. `(order_date, status)` forces it through every 2025 entry to check the status. An index on `status` alone finds all ~2,900 cancelled orders and then filters them by date.
