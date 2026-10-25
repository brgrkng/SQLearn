---
title: Weekend signups
kind: drill
hints:
  - "`extract(isodow FROM d)` numbers days 1 (Monday) to 7 (Sunday)."
  - "`extract(dow ...)` uses 0 for Sunday, which is a classic off-by-one trap."
---
Return the `customer_id` and `signup_date` of customers who signed up on a **Saturday or Sunday** in **December 2022**.

```sql starter
SELECT customer_id, signup_date
FROM customers
WHERE signup_date >= '2022-12-01' AND signup_date < '2023-01-01';
```

```sql solution
SELECT customer_id, signup_date
FROM customers
WHERE signup_date >= '2022-12-01' AND signup_date < '2023-01-01'
  AND extract(isodow FROM signup_date) IN (6, 7);
```

```sql wrong
SELECT customer_id, signup_date
FROM customers
WHERE signup_date >= '2022-12-01' AND signup_date < '2023-01-01'
  AND extract(dow FROM signup_date) IN (6, 7);
```
