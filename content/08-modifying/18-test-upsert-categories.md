---
title: Category sync
kind: test
---
In **one statement**, apply this category list: rename category **25** to **`Headphones & Earbuds`** (same parent), and add category **27** **`Smart Home`** under parent **2**. Existing rows are matched on `category_id`.

```sql solution
INSERT INTO categories (category_id, name, parent_id)
VALUES (25, 'Headphones & Earbuds', 7), (27, 'Smart Home', 2)
ON CONFLICT (category_id) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
```

```sql check Categories 25 and 27
SELECT category_id, name, parent_id FROM categories WHERE category_id IN (25, 27);
```

```sql check Category count
SELECT count(*) FROM categories;
```

```sql wrong
INSERT INTO categories (category_id, name, parent_id)
VALUES (25, 'Headphones & Earbuds', 7), (27, 'Smart Home', 2)
ON CONFLICT (category_id) DO NOTHING;
```
