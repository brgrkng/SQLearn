---
title: Catalogue price summary
kind: drill
hints:
  - "`min`, `max`, `avg` and `round(..., 2)`."
---
For products that are **not discontinued**, return the cheapest price, the most expensive price, and the average price rounded to 2 decimals, in that order.

```sql starter
SELECT min(price), max(price), avg(price)
FROM products;
```

```sql solution
SELECT min(price), max(price), round(avg(price), 2) FROM products WHERE NOT discontinued;
```

```sql wrong
SELECT min(price), max(price), round(avg(price), 2) FROM products;
```
