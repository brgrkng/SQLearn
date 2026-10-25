---
title: Christmas shoppers
kind: drill
ordered: true
hints:
  - "`WHERE customer_id IN (SELECT customer_id FROM orders WHERE ...)`"
  - A join would list a customer once per order.
---
Return the `customer_id`, `first_name` and `country` of every customer who placed an order on **2024-12-24**, once each, sorted by `customer_id`.

```sql starter
SELECT c.customer_id, c.first_name, c.country
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_date = '2024-12-24'
ORDER BY c.customer_id;
```

```sql solution
SELECT customer_id, first_name, country
FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE order_date = '2024-12-24')
ORDER BY customer_id;
```
