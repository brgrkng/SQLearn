---
title: Products per price band
kind: drill
ordered: true
hints:
  - "Join to an inline `VALUES` table of bands with `ON p.price >= b.lo AND p.price < b.hi`."
---
Using these bands, count the products in each one. Return the band name and the count, in band order, cheapest first.

| band | from (inclusive) | to (exclusive) |
|---|---|---|
| `under 25` | 0 | 25 |
| `25-100` | 25 | 100 |
| `100-500` | 100 | 500 |
| `500+` | 500 | ∞ |

```sql solution
SELECT b.band, count(*) AS products
FROM products p
JOIN (VALUES ('under 25', 0, 25), ('25-100', 25, 100), ('100-500', 100, 500), ('500+', 500, 1e9))
     AS b(band, lo, hi)
  ON p.price >= b.lo AND p.price < b.hi
GROUP BY b.band, b.lo
ORDER BY b.lo;
```

```sql wrong
SELECT b.band, count(*) AS products
FROM products p
JOIN (VALUES ('under 25', 0, 25), ('25-100', 25, 100), ('100-500', 100, 500), ('500+', 500, 1e9))
     AS b(band, lo, hi)
  ON p.price >= b.lo AND p.price < b.hi
GROUP BY b.band
ORDER BY b.band;
```
