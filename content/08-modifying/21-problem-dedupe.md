---
title: Remove duplicates
kind: problem
difficulty: medium
dataset: empty
hints:
  - "Rank each email's rows by `signed_up_at` (then `id`) with `row_number()`, and delete the rows numbered above 1."
  - "`DELETE FROM signups WHERE id IN (SELECT id FROM (...) t WHERE rn > 1)`"
---
A buggy form created duplicate rows in `signups`. Delete the duplicates so that each **email** keeps only its **earliest** row (by `signed_up_at`, ties broken by the lowest `id`).

```sql setup
CREATE TABLE signups (id int PRIMARY KEY, email text NOT NULL, signed_up_at timestamp NOT NULL);
INSERT INTO signups VALUES
  (1, 'ana@example.com',  '2026-01-01 09:00'), (2, 'ben@example.com', '2026-01-01 09:05'),
  (3, 'ana@example.com',  '2026-01-01 09:01'), (4, 'cy@example.com',  '2026-01-02 10:00'),
  (5, 'ben@example.com',  '2026-01-01 09:05'), (6, 'ana@example.com', '2025-12-31 23:59'),
  (7, 'dee@example.com',  '2026-01-03 08:00'), (8, 'cy@example.com',  '2026-01-02 10:00');
```

```sql solution
DELETE FROM signups
WHERE id IN (
  SELECT id FROM (
    SELECT id, row_number() OVER (PARTITION BY email ORDER BY signed_up_at, id) AS rn FROM signups
  ) ranked
  WHERE rn > 1
);
```

```sql check Remaining rows
SELECT id, email, signed_up_at FROM signups;
```

```sql wrong
DELETE FROM signups s
USING signups t
WHERE s.email = t.email AND s.id > t.id;
```

## Explanation
"Keep the lowest id" isn't the rule here: for `ana@example.com` the earliest row is id 6. Ranking within each email by the real rule and deleting everything ranked after the first is the general recipe. On tables without a key, PostgreSQL's hidden `ctid` column can stand in for `id`.
