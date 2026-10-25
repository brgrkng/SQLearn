---
title: Never cancelled
kind: drill
ordered: true
hints:
  - "`bool_and(status <> 'cancelled')` is true only if no order was cancelled."
---
Find customers with **at least 25 orders** who have **never had an order cancelled**. Return `customer_id` and their order count, sorted by `customer_id`.

```sql solution
SELECT customer_id, count(*) AS orders
FROM orders
GROUP BY customer_id
HAVING count(*) >= 25 AND bool_and(status <> 'cancelled')
ORDER BY customer_id;
```

```sql wrong
SELECT customer_id, count(*) AS orders
FROM orders
WHERE status <> 'cancelled'
GROUP BY customer_id
HAVING count(*) >= 25
ORDER BY customer_id;
```

## Explanation
Filtering out cancelled orders in `WHERE` doesn't answer the question. It counts each customer's *non-cancelled* orders, so customers who did cancel are still listed. The condition is about the whole group ("no order in this group was cancelled"), so it belongs in `HAVING`. `bool_and` expresses "every row satisfies…" directly. `count(*) FILTER (WHERE status = 'cancelled') = 0` works too.
