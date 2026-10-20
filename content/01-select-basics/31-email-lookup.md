---
title: Login lookup
kind: drill
hints:
  - "`customers.email` has a UNIQUE constraint, so it has an index."
  - Emails are already stored in lower case.
---
The login page finds a customer by email. Rewrite the query below so it can use the index on `email`. Every stored email is already lower case, so the `lower()` call isn't needed.

```sql starter
SELECT customer_id, first_name, last_name
FROM customers
WHERE lower(email) = 'mateo.wilson2718@example.com';
```

```sql solution
SELECT customer_id, first_name, last_name FROM customers WHERE email = 'mateo.wilson2718@example.com';
```

## Explanation
Wrapping the column in a function hides it from a plain index. When you genuinely need case-insensitive lookups, the fix is to store emails normalised (as this shop does) or to create an **expression index** on `lower(email)`. You'll build both in the indexes module.
