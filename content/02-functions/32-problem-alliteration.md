---
title: Alliterative names
kind: problem
difficulty: easy
ordered: true
---
Marketing wants to feature customers whose first and last names **start with the same letter** (like *Mia Murphy*). Return `customer_id`, `first_name` and `last_name`, sorted by `customer_id`.

```sql solution
SELECT customer_id, first_name, last_name
FROM customers
WHERE left(first_name, 1) = left(last_name, 1)
ORDER BY customer_id;
```

```sql wrong
SELECT customer_id, first_name, last_name
FROM customers
WHERE first_name LIKE left(last_name, 2) || '%'
ORDER BY customer_id;
```
