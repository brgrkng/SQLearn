---
title: The complete kit
kind: problem
difficulty: hard
ordered: true
hints:
  - "This is *relational division*: customers for whom there's no required product they *haven't* bought."
  - "Or count: the number of distinct required products a customer bought equals the number of required products."
---
The **Lumen** camera kit is every product in category **10** (*Cameras*) whose name starts with `Lumen `. Return the `customer_id` of customers who have bought **every** product in the kit (across any of their orders), sorted.

```sql solution
SELECT o.customer_id
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p     ON p.product_id = oi.product_id
WHERE p.category_id = 10 AND p.name LIKE 'Lumen %'
GROUP BY o.customer_id
HAVING count(DISTINCT p.product_id) = (SELECT count(*) FROM products WHERE category_id = 10 AND name LIKE 'Lumen %')
ORDER BY o.customer_id;
```

```sql wrong
SELECT DISTINCT o.customer_id
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p     ON p.product_id = oi.product_id
WHERE p.category_id = 10 AND p.name LIKE 'Lumen %'
ORDER BY o.customer_id;
```

```sql wrong
SELECT o.customer_id
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p     ON p.product_id = oi.product_id
WHERE p.category_id = 10 AND p.name LIKE 'Lumen %'
GROUP BY o.customer_id
HAVING count(*) >= (SELECT count(*) FROM products WHERE category_id = 10 AND name LIKE 'Lumen %')
ORDER BY o.customer_id;
```
