---
title: Apply a price list
kind: drill
hints:
  - "`UPDATE products p SET price = n.price FROM new_prices n WHERE n.product_id = p.product_id`"
---
The setup loads a table `new_prices(product_id, price)`. Update each listed product's price to the new value. Products not on the list keep their price.

```sql setup
CREATE TABLE new_prices (product_id int PRIMARY KEY, price numeric(10,2) NOT NULL);
INSERT INTO new_prices VALUES (1, 54.99), (2, 29.99), (50, 999.00), (200, 15.00), (456, 33.33);
```

```sql solution
UPDATE products p SET price = n.price FROM new_prices n WHERE n.product_id = p.product_id;
```

```sql check Listed products have their new prices
SELECT p.product_id, p.price FROM products p JOIN new_prices n USING (product_id);
```

```sql check Everything else is unchanged
SELECT sum(price) FROM products WHERE product_id NOT IN (SELECT product_id FROM new_prices);
```

```sql wrong
UPDATE products p SET price = (SELECT n.price FROM new_prices n WHERE n.product_id = p.product_id);
```

## Explanation
The wrong version has no `WHERE`, so every product *not* in `new_prices` gets its price set to the subquery's result for no row, which is NULL. Here the `NOT NULL` constraint on `price` makes it fail outright. On a nullable column it would silently wipe the data.
