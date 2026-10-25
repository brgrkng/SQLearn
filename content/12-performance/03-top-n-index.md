---
title: The most expensive lines
kind: drill
costSlack: 10
hints:
  - The query sorts 125,000 rows to keep 10. An index already in the right order removes the sort.
---
This report sorts every order line to find the ten priciest. Create an index so it can read the top ten directly.

```sql norun
SELECT order_id, product_id, unit_price FROM order_items ORDER BY unit_price DESC LIMIT 10;
```

```sql solution
CREATE INDEX order_items_unit_price_idx ON order_items (unit_price);
```

```sql explain
SELECT order_id, product_id, unit_price FROM order_items ORDER BY unit_price DESC LIMIT 10;
```

```sql wrong
CREATE INDEX order_items_product_idx ON order_items (product_id, unit_price);
```
