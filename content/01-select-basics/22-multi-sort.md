---
title: Platinum members by country
kind: drill
ordered: true
hints:
  - Each sort key can have its own `ASC` or `DESC`.
---
List **platinum**-tier customers: their `customer_id`, `country` and `signup_date`.

Sort by country A→Z. Within a country, show the **newest** signups first, and break ties by `customer_id`.

```sql starter
SELECT customer_id, country, signup_date
FROM customers
WHERE loyalty_tier = 'platinum'
```

```sql solution
SELECT customer_id, country, signup_date
FROM customers
WHERE loyalty_tier = 'platinum'
ORDER BY country, signup_date DESC, customer_id;
```

```sql wrong
SELECT customer_id, country, signup_date
FROM customers
WHERE loyalty_tier = 'platinum'
ORDER BY country, signup_date, customer_id;
```

```sql wrong
SELECT customer_id, country, signup_date
FROM customers
WHERE loyalty_tier = 'platinum'
ORDER BY country DESC, signup_date DESC, customer_id;
```
