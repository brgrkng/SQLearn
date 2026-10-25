---
title: Signup quarters
kind: test
---
For customers in **Japan** who signed up in **2022**, return `customer_id`, `signup_date`, and a label like `Q3 2022` for the quarter they signed up in.

```sql solution
SELECT customer_id, signup_date, 'Q' || extract(quarter FROM signup_date) || ' ' || extract(year FROM signup_date) AS quarter
FROM customers
WHERE country = 'Japan' AND signup_date >= '2022-01-01' AND signup_date < '2023-01-01';
```

```sql wrong
SELECT customer_id, signup_date, 'Q' || extract(month FROM signup_date) || ' ' || extract(year FROM signup_date) AS quarter
FROM customers
WHERE country = 'Japan' AND signup_date >= '2022-01-01' AND signup_date < '2023-01-01';
```

```sql wrong
SELECT customer_id, signup_date, to_char(signup_date, 'Q YYYY') AS quarter
FROM customers
WHERE country = 'Japan' AND signup_date >= '2022-01-01' AND signup_date < '2023-01-01';
```
