---
title: Brand and item
kind: drill
hints:
  - The brand is the first word of the name.
  - "`substring(name FROM position(' ' IN name) + 1)` is everything after the first space."
---
Every product name is a brand followed by the item, such as `Zenith Ultrabook`. For each product, return `product_id`, the **brand** and the **item** as separate columns.

```sql starter
SELECT product_id, name
FROM products;
```

```sql solution
SELECT product_id,
       split_part(name, ' ', 1) AS brand,
       substring(name FROM position(' ' IN name) + 1) AS item
FROM products;
```

```sql wrong
SELECT product_id, split_part(name, ' ', 1), split_part(name, ' ', 2) FROM products;
```

## Explanation
`split_part(name, ' ', 2)` only returns the *second word*, so `Over-Ear Headphones` comes back as `Over-Ear`. Taking everything after the first space keeps multi-word items intact.
