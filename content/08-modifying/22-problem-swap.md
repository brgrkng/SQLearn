---
title: Swap two prices
kind: problem
difficulty: medium
hints:
  - Two separate UPDATEs need a temporary value. One UPDATE with a CASE doesn't.
  - "In a single UPDATE, every right-hand side sees the row's **old** values."
---
Product **1** and product **2** were priced the wrong way round. Swap their prices in a **single statement**, without hard-coding either price.

```sql solution
UPDATE products p
SET price = other.price
FROM products other
WHERE (p.product_id, other.product_id) IN ((1, 2), (2, 1));
```

```sql check Prices of products 1 and 2
SELECT product_id, price FROM products WHERE product_id IN (1, 2);
```

```sql check Nothing else changed
SELECT sum(price) FROM products WHERE product_id > 2;
```

```sql wrong
UPDATE products SET price = (SELECT price FROM products WHERE product_id = 2) WHERE product_id = 1;
UPDATE products SET price = (SELECT price FROM products WHERE product_id = 1) WHERE product_id = 2;
```
