---
title: Category and parent
kind: drill
ordered: true
hints:
  - "`categories.parent_id` refers to another category."
  - Top-level categories have no parent. Keep them with a LEFT JOIN.
---
Return every category's `name` and its **parent category's name** (NULL for top-level categories), sorted by the category's `category_id`.

```sql starter
SELECT category_id, name, parent_id
FROM categories
ORDER BY category_id;
```

```sql solution
SELECT c.name, parent.name AS parent
FROM categories c
LEFT JOIN categories parent ON parent.category_id = c.parent_id
ORDER BY c.category_id;
```

```sql wrong
SELECT c.name, parent.name AS parent
FROM categories c
JOIN categories parent ON parent.category_id = c.parent_id
ORDER BY c.category_id;
```
