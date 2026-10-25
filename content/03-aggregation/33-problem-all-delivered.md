---
title: Perfect delivery record
kind: problem
difficulty: hard
ordered: true
hints:
  - The condition is about *every* order of a customer.
  - Exclude orders that are still in progress first, then use `bool_and` (or compare counts).
---
A customer has a **perfect record** if every one of their **completed** orders (status `delivered`, `returned` or `cancelled`; ignore `pending` and `shipped`) was `delivered`. Among customers with **at least 20 completed orders**, return the `customer_id` and number of completed orders of those with a perfect record, sorted by `customer_id`.

```sql solution
SELECT customer_id, count(*) AS completed
FROM orders
WHERE status IN ('delivered', 'returned', 'cancelled')
GROUP BY customer_id
HAVING count(*) >= 20 AND bool_and(status = 'delivered')
ORDER BY customer_id;
```

```sql wrong
SELECT customer_id, count(*) AS completed
FROM orders
GROUP BY customer_id
HAVING count(*) >= 20 AND bool_and(status = 'delivered')
ORDER BY customer_id;
```

```sql wrong
SELECT customer_id, count(*) AS completed
FROM orders
WHERE status = 'delivered'
GROUP BY customer_id
HAVING count(*) >= 20
ORDER BY customer_id;
```
