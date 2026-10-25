---
title: An enum for sizes
kind: drill
dataset: empty
hints:
  - "`CREATE TYPE shirt_size AS ENUM ('S', 'M', 'L', 'XL');`"
  - Enums sort in the order you declare them.
---
Create an enum type `shirt_size` with the values `S`, `M`, `L` and `XL` (in that order), and a table `shirts` with `shirt_id` (`int`, primary key) and `size` (`shirt_size`, required). Sizes must sort from smallest to largest.

```sql solution
CREATE TYPE shirt_size AS ENUM ('S', 'M', 'L', 'XL');
CREATE TABLE shirts (shirt_id int PRIMARY KEY, size shirt_size NOT NULL);
```

```sql check Sizes sort in size order
INSERT INTO shirts VALUES (1, 'XL'), (2, 'S'), (3, 'L'), (4, 'M');
SELECT array_agg(size ORDER BY size)::text FROM shirts;
```

```sql check Unknown sizes are rejected
INSERT INTO shirts VALUES (5, 'XXL');
```

```sql wrong
CREATE TABLE shirts (shirt_id int PRIMARY KEY, size text NOT NULL CHECK (size IN ('S', 'M', 'L', 'XL')));
```
