---
title: Reserve stock
kind: test
dataset: empty
---
Reserve **2** units of product **10** for an order, but only if at least 2 are in stock, in a **single statement** that returns the product's remaining stock (no rows if there wasn't enough). Then attempt the same reservation of **5** units of product **11**, which only has 3.

```sql setup
CREATE TABLE stock (product_id int PRIMARY KEY, on_hand int NOT NULL);
INSERT INTO stock VALUES (10, 4), (11, 3), (12, 0);
```

```sql solution
UPDATE stock SET on_hand = on_hand - 2 WHERE product_id = 10 AND on_hand >= 2 RETURNING on_hand;
UPDATE stock SET on_hand = on_hand - 5 WHERE product_id = 11 AND on_hand >= 5 RETURNING on_hand;
```

```sql check Stock levels
SELECT product_id, on_hand FROM stock;
```

```sql wrong
UPDATE stock SET on_hand = on_hand - 2 WHERE product_id = 10 RETURNING on_hand;
UPDATE stock SET on_hand = on_hand - 5 WHERE product_id = 11 RETURNING on_hand;
```
