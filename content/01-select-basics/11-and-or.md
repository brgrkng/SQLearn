---
title: Audio deals
kind: drill
hints:
  - "`AND` is evaluated before `OR`. Use parentheses, or `IN`, to group the two categories."
---
Audio products live in two categories: **7** (*Audio*) and **25** (*Headphones*). Return the `name`, `category_id` and `price` of audio products that cost **less than $60**.

```sql starter
SELECT name, category_id, price
FROM products
WHERE category_id = 7 OR category_id = 25 AND price < 60;
```

```sql solution
SELECT name, category_id, price FROM products WHERE category_id IN (7, 25) AND price < 60;
```

## Explanation
The starter query reads as `category_id = 7 OR (category_id = 25 AND price < 60)`, so every Audio product slipped through regardless of price. `(category_id = 7 OR category_id = 25) AND price < 60` fixes it, and so does `category_id IN (7, 25) AND price < 60`, which is shorter and harder to get wrong.
