---
title: A new category
kind: drill
hints:
  - "`INSERT INTO categories (category_id, name, parent_id) VALUES (...)`"
---
Add a category with id **27**, named **`Smart Home`**, as a subcategory of **Home & Kitchen** (category 2).

```sql starter
INSERT INTO categories
```

```sql solution
INSERT INTO categories (category_id, name, parent_id) VALUES (27, 'Smart Home', 2);
```

```sql check The new category exists with the right parent
SELECT category_id, name, parent_id FROM categories WHERE category_id = 27;
```

```sql check Nothing else changed
SELECT count(*) FROM categories;
```

```sql wrong
INSERT INTO categories (category_id, name, parent_id) VALUES (27, 'Smart Home', 1);
```
