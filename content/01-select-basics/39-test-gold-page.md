---
title: Second page of gold members
kind: test
ordered: true
---
An admin screen lists **gold**-tier customers ordered by `signup_date` (oldest first) and then `customer_id`, 10 per page. Return the `customer_id` and `signup_date` of the customers on **page 2**.

```sql solution
SELECT customer_id, signup_date
FROM customers
WHERE loyalty_tier = 'gold'
ORDER BY signup_date, customer_id
LIMIT 10 OFFSET 10;
```

```sql wrong
SELECT customer_id, signup_date
FROM customers
WHERE loyalty_tier = 'gold'
ORDER BY signup_date, customer_id
LIMIT 10 OFFSET 20;
```

```sql wrong
SELECT customer_id, signup_date
FROM customers
WHERE loyalty_tier = 'gold'
ORDER BY signup_date DESC, customer_id
LIMIT 10 OFFSET 10;
```
