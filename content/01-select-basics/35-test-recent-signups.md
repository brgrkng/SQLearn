---
title: Recent signups in Germany and France
kind: test
ordered: true
---
Return the `customer_id`, `country` and `signup_date` of customers from **Germany or France** who signed up **on or after 6 July 2023**. Newest signups first, ties broken by `customer_id`.

```sql solution
SELECT customer_id, country, signup_date
FROM customers
WHERE country IN ('Germany', 'France') AND signup_date >= '2023-07-06'
ORDER BY signup_date DESC, customer_id;
```

```sql wrong
SELECT customer_id, country, signup_date
FROM customers
WHERE country = 'Germany' OR country = 'France' AND signup_date >= '2023-07-06'
ORDER BY signup_date DESC, customer_id;
```

```sql wrong
SELECT customer_id, country, signup_date
FROM customers
WHERE country IN ('Germany', 'France') AND signup_date > '2023-07-06'
ORDER BY signup_date DESC, customer_id;
```
