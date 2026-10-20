---
title: Last name first
kind: drill
hints:
  - "`||` joins strings. A literal string such as `', '` goes in single quotes."
---
Return each customer's `customer_id` and their name written **last name first**, for example `Okafor, Mary`.

```sql starter
SELECT customer_id, first_name, last_name
FROM customers;
```

```sql solution
SELECT customer_id, last_name || ', ' || first_name AS full_name FROM customers;
```

```sql wrong
SELECT customer_id, last_name || ',' || first_name FROM customers;
```

```sql wrong
SELECT customer_id, first_name || ' ' || last_name FROM customers;
```
