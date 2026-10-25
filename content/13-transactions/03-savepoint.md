---
title: Undo just the mistake
kind: drill
dataset: empty
hints:
  - "`SAVEPOINT name;` before the risky step, `ROLLBACK TO SAVEPOINT name;` to undo just that step."
---
Inside **one transaction**: give every product a **10%** price rise, then set a savepoint, then (by mistake) set **all** prices to 0. Undo **only the mistake** using the savepoint, then **discontinue** product 3, and commit.

```sql setup
CREATE TABLE products (product_id int PRIMARY KEY, price numeric(10,2) NOT NULL, discontinued boolean NOT NULL DEFAULT false);
INSERT INTO products VALUES (1, 10.00, false), (2, 20.00, false), (3, 30.00, false);
```

```sql solution
BEGIN;
UPDATE products SET price = price * 1.10;
SAVEPOINT before_mistake;
UPDATE products SET price = 0;
ROLLBACK TO SAVEPOINT before_mistake;
UPDATE products SET discontinued = true WHERE product_id = 3;
COMMIT;
```

```sql check Final state
SELECT product_id, price, discontinued FROM products;
```

```sql wrong
BEGIN;
UPDATE products SET price = price * 1.10;
SAVEPOINT before_mistake;
UPDATE products SET price = 0;
ROLLBACK;
UPDATE products SET discontinued = true WHERE product_id = 3;
```
