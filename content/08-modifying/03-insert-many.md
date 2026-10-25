---
title: Three at once
kind: drill
hints:
  - One `INSERT` with three parenthesised rows after `VALUES`, separated by commas.
---
In a **single statement**, add three subcategories of **Toys & Games** (category 6): id **27** `Outdoor Toys`, id **28** `Building Sets` and id **29** `Card Games`.

```sql solution
INSERT INTO categories (category_id, name, parent_id)
VALUES (27, 'Outdoor Toys', 6), (28, 'Building Sets', 6), (29, 'Card Games', 6);
```

```sql check The three categories exist
SELECT category_id, name, parent_id FROM categories WHERE category_id >= 27;
```

```sql wrong
INSERT INTO categories (category_id, name, parent_id)
VALUES (27, 'Outdoor Toys', 6), (28, 'Building Sets', 6);
```
