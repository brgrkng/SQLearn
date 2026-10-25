---
title: Customer, order and product
kind: drill
hints:
  - "Chain the joins: `orders` → `customers`, `orders` → `order_items` → `products`."
---
For orders placed on **2025-12-01**, return one row per order line: `order_id`, the customer's `last_name`, the product `name` and the `quantity`.

```sql starter
SELECT o.order_id, oi.product_id, oi.quantity
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.order_date = '2025-12-01';
```

```sql solution
SELECT o.order_id, c.last_name, p.name, oi.quantity
FROM orders o
JOIN customers c    ON c.customer_id = o.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p     ON p.product_id = oi.product_id
WHERE o.order_date = '2025-12-01';
```
