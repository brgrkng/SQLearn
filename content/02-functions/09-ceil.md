---
title: Round down to whole dollars
kind: drill
hints:
  - "`round` goes to the *nearest* whole number. `floor` (or `trunc`) always goes down."
---
The clearance sign shows prices rounded **down** to whole dollars ($49.99 becomes $49). For products in category **24** (*Puzzles*), return `name`, `price`, and the price rounded down.

```sql starter
SELECT name, price
FROM products
WHERE category_id = 24;
```

```sql solution
SELECT name, price, floor(price) AS sign_price FROM products WHERE category_id = 24;
```

```sql wrong
SELECT name, price, round(price) AS sign_price FROM products WHERE category_id = 24;
```

```sql wrong
SELECT name, price, price::int AS sign_price FROM products WHERE category_id = 24;
```

## Explanation
Every price in the shop ends in .99, so `round` and `::int` both go *up* to the next dollar. `floor` and `trunc` agree for positive numbers. For negative numbers they differ: `floor(-2.5)` is -3, while `trunc(-2.5)` is -2.
