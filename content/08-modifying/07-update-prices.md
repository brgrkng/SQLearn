---
title: Puzzle price rise
kind: drill
hints:
  - "`UPDATE products SET price = round(price * 1.08, 2) WHERE ...`"
---
Raise the price of every product in category **24** (*Puzzles*) by **8%**, rounded to 2 decimal places. No other product may change.

```sql starter
UPDATE products SET price = round(price * 1.08, 2);
```

```sql solution
UPDATE products SET price = round(price * 1.08, 2) WHERE category_id = 24;
```

```sql check Puzzle prices went up 8%
SELECT product_id, price FROM products WHERE category_id = 24;
```

```sql check Other products are untouched
SELECT sum(price), count(*) FROM products WHERE category_id <> 24;
```

```sql wrong
UPDATE products SET price = round(price * 0.08, 2) WHERE category_id = 24;
```

## Explanation
The `round` is optional here. `price` is declared `numeric(10,2)`, so PostgreSQL rounds any value stored in it to 2 decimal places on assignment. Writing the rounding out explicitly still documents your intent, and it matters if the column type ever changes. Multiplying by `0.08` instead of `1.08` sets the price *to* 8% of its old value, a classic slip.
