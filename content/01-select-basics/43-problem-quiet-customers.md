---
title: Quiet early adopters
kind: problem
difficulty: medium
hints:
  - What does `NULL NOT IN ('London', 'Paris')` evaluate to?
---
Find customers who **signed up in 2020**, have **no loyalty tier**, and **don't live in London or Paris**. Customers whose city is unknown count as not living in London or Paris. Return `customer_id`, `city` and `signup_date`.

```sql solution
SELECT customer_id, city, signup_date
FROM customers
WHERE signup_date >= '2020-01-01' AND signup_date < '2021-01-01'
  AND loyalty_tier IS NULL
  AND (city NOT IN ('London', 'Paris') OR city IS NULL);
```

```sql wrong
SELECT customer_id, city, signup_date
FROM customers
WHERE signup_date >= '2020-01-01' AND signup_date < '2021-01-01'
  AND loyalty_tier IS NULL
  AND city NOT IN ('London', 'Paris');
```

## Explanation
`city NOT IN ('London', 'Paris')` expands to `city <> 'London' AND city <> 'Paris'`. For a NULL city both comparisons are unknown, so the row is dropped, and the customers with an unknown city quietly vanish. The NOT IN trap gets worse with subqueries. You'll meet it again in Module 5.
