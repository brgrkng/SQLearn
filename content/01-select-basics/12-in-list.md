---
title: Three countries
kind: drill
hints:
  - "`country IN ('A', 'B', 'C')`"
---
Marketing is running a campaign in **Japan**, **Brazil** and **Kenya**. Return the `customer_id`, `first_name`, `last_name` and `country` of every customer in those countries.

```sql starter
SELECT customer_id, first_name, last_name, country
FROM customers
WHERE
```

```sql solution
SELECT customer_id, first_name, last_name, country
FROM customers
WHERE country IN ('Japan', 'Brazil', 'Kenya');
```

```sql wrong
SELECT customer_id, first_name, last_name, country
FROM customers
WHERE country IN ('japan', 'brazil', 'kenya');
```
