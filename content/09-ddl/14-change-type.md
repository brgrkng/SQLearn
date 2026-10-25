---
title: Fix a column type
kind: drill
dataset: empty
hints:
  - "`ALTER TABLE ... ALTER COLUMN price TYPE numeric(8,2) USING price::numeric`"
---
Someone stored prices as text. Convert the `price` column of `catalogue` to `numeric(8,2)`, keeping every existing value.

```sql setup
CREATE TABLE catalogue (item_id int PRIMARY KEY, price text NOT NULL);
INSERT INTO catalogue VALUES (1, '12.50'), (2, '7'), (3, '199.99');
```

```sql solution
ALTER TABLE catalogue ALTER COLUMN price TYPE numeric(8,2) USING price::numeric;
```

```sql check Values survived
SELECT item_id, price FROM catalogue;
```

```sql check The column is numeric(8,2)
SELECT data_type, numeric_precision, numeric_scale FROM information_schema.columns
WHERE table_name = 'catalogue' AND column_name = 'price';
```

```sql check Prices now sort numerically
SELECT item_id FROM catalogue ORDER BY price DESC LIMIT 1;
```

```sql wrong
ALTER TABLE catalogue ALTER COLUMN price TYPE numeric USING price::numeric;
```
