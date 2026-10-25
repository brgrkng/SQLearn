---
title: Fix it properly
kind: problem
difficulty: medium
costSlack: 10
hints:
  - "The `extract` call hides `order_date` from any index. Rewrite it as a date range."
  - "The best index puts `status` first (equality) and `order_date` second (range)."
  - "Put the CREATE INDEX first and your query last. The last statement is the one measured."
---
This query counts **returned orders placed in 2024**, but it's slow, and there's no index to help. **Create an index and rewrite the query** so it's efficient. Your SQL should end with the rewritten query, returning the same single count.

```sql norun
SELECT count(*) FROM orders WHERE status = 'returned' AND extract(year FROM order_date) = 2024;
```

```sql solution
CREATE INDEX orders_status_date_idx ON orders (status, order_date);
SELECT count(*) FROM orders WHERE status = 'returned' AND order_date >= '2024-01-01' AND order_date < '2025-01-01';
```

```sql wrong
CREATE INDEX orders_status_date_idx ON orders (status, order_date);
SELECT count(*) FROM orders WHERE status = 'returned' AND extract(year FROM order_date) = 2024;
```

```sql wrong
SELECT count(*) FROM orders WHERE status = 'returned' AND order_date >= '2024-01-01' AND order_date < '2025-01-01';
```

```sql wrong
CREATE INDEX orders_status_idx ON orders (status);
SELECT count(*) FROM orders WHERE status = 'returned' AND order_date >= '2024-01-01' AND order_date < '2025-01-01';
```
