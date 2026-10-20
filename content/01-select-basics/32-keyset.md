---
title: The next page, fast
kind: drill
ordered: true
hints:
  - You know the last `order_id` the user saw. Start right after it.
---
An admin screen pages through orders by `order_id`, 20 at a time. The last order on the current screen is **45210**. Return the `order_id` and `order_date` of the **next 20 orders** in `order_id` order.

The starter is correct but slow. Make it cheap.

```sql starter
SELECT order_id, order_date
FROM orders
ORDER BY order_id
LIMIT 20 OFFSET 45210;
```

```sql solution
SELECT order_id, order_date FROM orders WHERE order_id > 45210 ORDER BY order_id LIMIT 20;
```

```sql wrong
SELECT order_id, order_date FROM orders WHERE order_id >= 45210 ORDER BY order_id LIMIT 20;
```

## Explanation
`OFFSET 45210` only works here because order IDs happen to have no gaps. In a real table with deleted rows, OFFSET and "the next 20 after 45210" give different answers, and keyset pagination is the one that's correct. It's also cheaper: the index jumps straight to 45211 instead of walking past 45,210 rows.
