---
title: Case-insensitive login
kind: drill
costSlack: 10
hints:
  - "Index the expression the query uses: `CREATE INDEX ... ON customers (lower(email));`"
  - "Run `ANALYZE customers;` afterwards so the planner has statistics for the expression."
---
Logins compare emails case-insensitively, and the query can't change. Make it use an index.

```sql norun
SELECT customer_id, first_name FROM customers WHERE lower(email) = 'mateo.wilson2718@example.com';
```

```sql solution
CREATE INDEX customers_lower_email_idx ON customers (lower(email));
ANALYZE customers;
```

```sql explain
SELECT customer_id, first_name FROM customers WHERE lower(email) = 'mateo.wilson2718@example.com';
```

```sql wrong
CREATE INDEX customers_email_idx2 ON customers (email);
ANALYZE customers;
```
