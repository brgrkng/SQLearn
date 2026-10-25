---
title: A customer summary view
kind: drill
hints:
  - "`CREATE VIEW customer_summary AS SELECT ... FROM customers c LEFT JOIN orders o ... GROUP BY ...`"
---
Create a view `customer_summary` with one row per customer: `customer_id`, `country`, `orders` (their number of orders, 0 if none) and `first_order` (date of their first order, NULL if none).

```sql solution
CREATE VIEW customer_summary AS
SELECT c.customer_id, c.country, count(o.order_id) AS orders, min(o.order_date) AS first_order
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.country;
```

```sql check Kenyan customers in the view
SELECT customer_id, orders, first_order FROM customer_summary WHERE country = 'Kenya';
```

```sql check Every customer appears once
SELECT count(*), count(DISTINCT customer_id), sum(orders) FROM customer_summary;
```

```sql wrong
CREATE VIEW customer_summary AS
SELECT c.customer_id, c.country, count(*) AS orders, min(o.order_date) AS first_order
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.country;
```
