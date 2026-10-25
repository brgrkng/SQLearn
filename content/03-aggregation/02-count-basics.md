---
title: How many have shipped?
kind: drill
hints:
  - "`count(*)` counts rows, `count(column)` counts non-NULL values."
---
Return one row with two columns: the total number of **orders**, and how many of them have a **shipped_date**.

```sql starter
SELECT count(*)
FROM orders;
```

```sql solution
SELECT count(*) AS orders, count(shipped_date) AS shipped FROM orders;
```

```sql wrong
SELECT count(*) AS orders, count(*) AS shipped FROM orders;
```
