---
title: Orders per customer, on average
kind: drill
hints:
  - Count orders per customer in a subquery in `FROM`, then average those counts.
---
Among customers who have placed at least one order, what is the **average number of orders per customer**, rounded to 2 decimals? Return a single number.

```sql starter
SELECT round(avg(count(*)), 2)
FROM orders
GROUP BY customer_id;
```

```sql solution
SELECT round(avg(n), 2) AS avg_orders
FROM (SELECT customer_id, count(*) AS n FROM orders GROUP BY customer_id) AS per_customer;
```

```sql wrong
SELECT round(count(*)::numeric / (SELECT count(*) FROM customers), 2) FROM orders;
```
