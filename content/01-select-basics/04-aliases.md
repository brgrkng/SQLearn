---
title: Rename the columns
kind: drill
columnNames: true
hints:
  - "`expression AS new_name` renames a result column."
---
The warehouse team wants a stock report with friendlier headings. For every product, return:

- `name`, renamed to **product**
- `stock`, renamed to **units_left**

This exercise checks column names as well as values.

```sql starter
SELECT name, stock
FROM products;
```

```sql solution
SELECT name AS product, stock AS units_left FROM products;
```

```sql wrong
SELECT name AS units_left, stock AS product FROM products;
```

## Explanation
Aliases only change the names in the result. Grading usually ignores column names, but reports, APIs and application code often depend on them, so it's worth getting them exactly right.
