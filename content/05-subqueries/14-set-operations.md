---
title: UNION, INTERSECT and EXCEPT
kind: lesson
---
Set operations combine the results of two queries **vertically**, stacking rows rather than adding columns as a join does.

| Operation | Returns |
|---|---|
| `A UNION B` | rows in A or B, duplicates removed |
| `A UNION ALL B` | every row of A followed by every row of B |
| `A INTERSECT B` | rows in both A and B |
| `A EXCEPT B` | rows in A that are not in B |

```sql
SELECT customer_id FROM orders WHERE order_date = '2024-12-24'
INTERSECT
SELECT customer_id FROM orders WHERE order_date = '2025-12-24'
ORDER BY customer_id;
```

## Rules

- Both queries must return the **same number of columns**, with compatible types. Columns are matched by **position**, not name.
- Column names come from the **first** query.
- `ORDER BY` and `LIMIT` apply to the **whole** result. Put them at the very end.
- Like `DISTINCT`, these operations treat NULLs as equal to each other.

## UNION vs UNION ALL

`UNION` removes duplicates, which means sorting or hashing the combined result. When duplicates are impossible, or you want them, use `UNION ALL`. It's cheaper and it doesn't silently drop rows:

```sql
SELECT 'signup' AS event, signup_date AS day FROM customers WHERE customer_id <= 3
UNION ALL
SELECT 'order', order_date FROM orders WHERE customer_id <= 3 AND order_date < '2022-02-01'
ORDER BY day, event;
```

A **label column** like `event` is the usual way to remember which branch a row came from.

## EXCEPT for "in this set but not that one"

```sql
SELECT product_id FROM order_items oi JOIN orders o USING (order_id) WHERE o.order_date < '2022-02-01'
EXCEPT
SELECT product_id FROM order_items oi JOIN orders o USING (order_id) WHERE o.order_date >= '2025-12-01'
ORDER BY product_id;
```

`EXCEPT` removes duplicates, compares whole rows, and handles NULLs safely. It's often the clearest way to answer "what's missing?" questions.

> **Dialect note.** Oracle spells `EXCEPT` as `MINUS`. MySQL only gained `INTERSECT` and `EXCEPT` in 8.0.31. `UNION` and `UNION ALL` work everywhere.
