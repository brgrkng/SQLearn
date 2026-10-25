---
title: Basket sizes
kind: problem
difficulty: medium
ordered: true
hints:
  - First count lines per order, then group those results by the count.
  - "Put the per-order query in parentheses in the FROM clause and give it an alias: `FROM (SELECT order_id, count(*) AS lines FROM order_items GROUP BY order_id) AS t`."
---
How are orders distributed by **number of lines**? Return `lines` (the number of distinct products in an order) and how many orders have that many lines, sorted by `lines`.

You'll need to aggregate twice: once per order, then per line count. A query in parentheses with an alias can be used as a table. Subqueries get a full treatment in Module 5.

```sql solution
SELECT lines, count(*) AS orders
FROM (SELECT order_id, count(*) AS lines FROM order_items GROUP BY order_id) AS per_order
GROUP BY lines
ORDER BY lines;
```

```sql wrong
SELECT count(*) AS lines, count(DISTINCT order_id) AS orders
FROM order_items
GROUP BY product_id
ORDER BY lines;
```
