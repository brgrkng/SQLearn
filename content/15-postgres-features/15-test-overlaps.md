---
title: Overlapping holidays
kind: test
dataset: empty
---
Find every **pair** of employees whose holidays **overlap** (each pair once, lower `employee` name first). Holidays are `daterange` values. Return both names.

```sql setup
CREATE TABLE holidays (employee text PRIMARY KEY, away daterange NOT NULL);
INSERT INTO holidays VALUES
  ('Ada', '[2026-07-01, 2026-07-15)'), ('Alan', '[2026-07-10, 2026-07-20)'),
  ('Grace', '[2026-07-15, 2026-07-25)'), ('Linus', '[2026-08-01, 2026-08-10)'),
  ('Barbara', '[2026-07-14, 2026-07-16)');
```

```sql solution
SELECT a.employee, b.employee
FROM holidays a JOIN holidays b ON a.employee < b.employee AND a.away && b.away;
```

```sql wrong
SELECT a.employee, b.employee
FROM holidays a JOIN holidays b ON a.employee <> b.employee AND a.away && b.away;
```

```sql wrong
SELECT a.employee, b.employee
FROM holidays a JOIN holidays b ON a.employee < b.employee AND upper(a.away) >= lower(b.away) AND upper(b.away) >= lower(a.away);
```
