---
title: Email domains
kind: drill
hints:
  - "`split_part(email, '@', 2)` is everything after the @."
---
Return each customer's `customer_id`, their `email`, and the **mailbox** part of the address (everything before the `@`). Skip customers with no email.

```sql starter
SELECT customer_id, email
FROM customers
WHERE email IS NOT NULL;
```

```sql solution
SELECT customer_id, email, split_part(email, '@', 1) AS mailbox
FROM customers
WHERE email IS NOT NULL;
```

```sql wrong
SELECT customer_id, email, split_part(email, '@', 2) AS mailbox
FROM customers
WHERE email IS NOT NULL;
```
