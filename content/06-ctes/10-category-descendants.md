---
title: Everything in Electronics
kind: drill
hints:
  - "Anchor: category 1. Recursive step: categories whose `parent_id` is in the set."
  - Then count products whose `category_id` is anywhere in that set.
---
Category **1** (*Electronics*) has subcategories, some of which have their own subcategories. How many **products** belong to Electronics **or any category beneath it**? Return a single number.

```sql solution
WITH RECURSIVE tree AS (
  SELECT category_id FROM categories WHERE category_id = 1
  UNION ALL
  SELECT c.category_id FROM categories c JOIN tree t ON c.parent_id = t.category_id
)
SELECT count(*) FROM products WHERE category_id IN (SELECT category_id FROM tree);
```

```sql wrong
SELECT count(*) FROM products p JOIN categories c ON c.category_id = p.category_id WHERE c.parent_id = 1;
```
