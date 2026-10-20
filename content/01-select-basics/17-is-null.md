---
title: No email on file
kind: drill
hints:
  - "`= NULL` is never true. There's a dedicated operator for testing for NULL."
---
Return the `customer_id`, `first_name` and `last_name` of every customer with **no email address**.

```sql starter
SELECT customer_id, first_name, last_name
FROM customers
WHERE email = NULL;
```

```sql solution
SELECT customer_id, first_name, last_name FROM customers WHERE email IS NULL;
```

```sql wrong
SELECT customer_id, first_name, last_name FROM customers WHERE email = '';
```
