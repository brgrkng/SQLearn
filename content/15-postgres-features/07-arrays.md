---
title: Tagged articles
kind: drill
dataset: empty
hints:
  - "`tags @> ARRAY['sql', 'advanced']` means it has both."
  - "`NOT (tags && ARRAY['draft'])` means no overlap with draft."
---
Return the `title` of articles tagged with **both** `sql` and `advanced` that are **not** tagged `draft`.

```sql setup
CREATE TABLE articles (article_id int PRIMARY KEY, title text NOT NULL, tags text[] NOT NULL);
INSERT INTO articles VALUES
  (1, 'Window functions', '{sql,advanced,analytics}'),
  (2, 'Recursive CTEs', '{sql,advanced,draft}'),
  (3, 'Intro to SQL', '{sql,beginner}'),
  (4, 'Query tuning', '{advanced,performance,sql}'),
  (5, 'Advanced Python', '{python,advanced}');
```

```sql solution
SELECT title FROM articles WHERE tags @> ARRAY['sql', 'advanced'] AND NOT (tags && ARRAY['draft']);
```

```sql wrong
SELECT title FROM articles WHERE tags && ARRAY['sql', 'advanced'] AND NOT (tags && ARRAY['draft']);
```

```sql wrong
SELECT title FROM articles WHERE tags @> ARRAY['sql', 'advanced'];
```
