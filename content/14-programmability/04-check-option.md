---
title: Edit through a view safely
kind: drill
hints:
  - "End the view definition with `WITH CHECK OPTION`."
---
Create an updatable view `budget_products` showing the `product_id`, `name` and `price` of products priced **under $20**. Updates through the view must **not** be able to push a product's price to $20 or more (which would make it vanish from the view).

```sql solution
CREATE VIEW budget_products AS
SELECT product_id, name, price FROM products WHERE price < 20
WITH CHECK OPTION;
```

```sql check Small price changes go through
UPDATE budget_products SET price = price + 1 WHERE price < 15 RETURNING product_id;
```

```sql check Prices can't leave the view
UPDATE budget_products SET price = 25 WHERE product_id = (SELECT min(product_id) FROM budget_products);
```

```sql check The view shows the right products
SELECT product_id FROM budget_products;
```

```sql wrong
CREATE VIEW budget_products AS
SELECT product_id, name, price FROM products WHERE price < 20;
```
