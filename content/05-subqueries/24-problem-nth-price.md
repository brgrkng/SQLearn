---
title: Twelfth-highest price
kind: problem
difficulty: medium
hints:
  - Many products share a price. You need distinct prices.
  - "`SELECT DISTINCT price ... ORDER BY price DESC LIMIT 1 OFFSET 11`"
---
Return the **12th-highest distinct product price** as a single value.

```sql solution
SELECT price
FROM (SELECT DISTINCT price FROM products) AS prices
ORDER BY price DESC
LIMIT 1 OFFSET 11;
```

```sql wrong
SELECT price FROM products ORDER BY price DESC LIMIT 1 OFFSET 11;
```

```sql wrong
SELECT DISTINCT price FROM products ORDER BY price DESC LIMIT 1 OFFSET 12;
```
