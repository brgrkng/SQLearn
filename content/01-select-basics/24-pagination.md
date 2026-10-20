---
title: Page three
kind: drill
ordered: true
hints:
  - Page 3 at 10 per page skips the first 20 rows.
---
The catalogue lists products **alphabetically by name**, 10 per page. Return the `product_id` and `name` of the products on **page 3**.

```sql starter
SELECT product_id, name
FROM products
ORDER BY name
```

```sql solution
SELECT product_id, name FROM products ORDER BY name LIMIT 10 OFFSET 20;
```

```sql wrong
SELECT product_id, name FROM products ORDER BY name LIMIT 10 OFFSET 30;
```
