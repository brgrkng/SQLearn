---
title: Frequent customers
kind: drill
ordered: true
hints:
  - The condition uses `count(*)`, so it belongs in `HAVING`.
---
Return the `customer_id` and order count of customers with **more than 35 orders**, most orders first, ties broken by `customer_id`.

```sql starter
SELECT customer_id, count(*) AS orders
FROM orders
WHERE count(*) > 35
GROUP BY customer_id;
```

```sql solution
SELECT customer_id, count(*) AS orders
FROM orders
GROUP BY customer_id
HAVING count(*) > 35
ORDER BY orders DESC, customer_id;
```

```sql wrong
SELECT customer_id, count(*) AS orders
FROM orders
GROUP BY customer_id
HAVING count(*) >= 35
ORDER BY orders DESC, customer_id;
```
