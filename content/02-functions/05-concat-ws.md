---
title: Shipping labels
kind: drill
hints:
  - "`||` turns the whole label NULL when the city is missing."
  - "`concat_ws(separator, ...)` skips NULL arguments."
---
Build a one-line address label for each customer in **Kenya**: `last_name`, `first_name`, `city` and `country`, separated by `, `. When the city is unknown, leave it out instead of producing NULL (for example `Mensah, Kofi, Kenya`). Return `customer_id` and the label.

```sql starter
SELECT customer_id, last_name || ', ' || first_name || ', ' || city || ', ' || country AS label
FROM customers
WHERE country = 'Kenya';
```

```sql solution
SELECT customer_id, concat_ws(', ', last_name, first_name, city, country) AS label
FROM customers
WHERE country = 'Kenya';
```

```sql wrong
SELECT customer_id, concat(last_name, ', ', first_name, ', ', city, ', ', country) AS label
FROM customers
WHERE country = 'Kenya';
```

## Explanation
`concat` also skips NULLs, but the separators around the missing city are separate arguments, so you get `Mensah, Kofi, , Kenya`. `concat_ws` only puts separators *between* the values that aren't NULL.
