---
title: Restock the shelves
kind: drill
hints:
  - "One `UPDATE` with `SET stock = CASE ... END`, limited to products that aren't discontinued."
---
For products that are **not discontinued**: if stock is **0**, set it to **25**; if stock is between **1 and 9**, add **10**. Leave all other products alone. Do it in one statement.

```sql solution
UPDATE products
SET stock = CASE WHEN stock = 0 THEN 25 ELSE stock + 10 END
WHERE NOT discontinued AND stock < 10;
```

```sql check New stock levels
SELECT product_id, stock FROM products WHERE stock BETWEEN 0 AND 40;
```

```sql check Discontinued products unchanged
SELECT sum(stock), count(*) FILTER (WHERE stock = 0) FROM products WHERE discontinued;
```

```sql wrong
UPDATE products
SET stock = CASE WHEN stock = 0 THEN 25 ELSE stock + 10 END
WHERE stock < 10;
```
