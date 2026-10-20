---
title: Unreachable customers
kind: test
---
Return the `customer_id`, `first_name` and `last_name` of customers we have **no email address and no city** for.

```sql solution
SELECT customer_id, first_name, last_name
FROM customers
WHERE email IS NULL AND city IS NULL;
```

```sql wrong
SELECT customer_id, first_name, last_name
FROM customers
WHERE email IS NULL OR city IS NULL;
```

```sql wrong
SELECT customer_id, first_name, last_name
FROM customers
WHERE email = NULL AND city = NULL;
```
