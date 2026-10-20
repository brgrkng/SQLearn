---
title: Make it sargable
kind: drill
hints:
  - The query is already correct. Run it with `EXPLAIN` in front and look at the plan.
  - Keep `order_id` bare on one side of the `=`.
---
This query from the order-tracking page returns the right row, but it reads every order to find it. Rewrite it so it can use the primary-key index. It should return the same columns.

```sql starter
SELECT order_id, customer_id, status
FROM orders
WHERE order_id - 1 = 31999;
```

```sql solution
SELECT order_id, customer_id, status FROM orders WHERE order_id = 32000;
```

```sql wrong
SELECT order_id, customer_id, status FROM orders WHERE order_id + 0 = 32000;
```

## Explanation
`order_id - 1 = 31999` and `order_id = 32000` mean the same thing, but the index stores `order_id` values, not `order_id - 1` values. PostgreSQL doesn't do the algebra for you, so it falls back to checking every row. That costs over 1,000, against about 8 for the index lookup.
