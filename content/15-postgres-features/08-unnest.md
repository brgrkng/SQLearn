---
title: Tag counts
kind: drill
dataset: empty
ordered: true
hints:
  - "`FROM articles, unnest(tags) AS tag` then `GROUP BY tag`."
---
Return each tag and how many articles use it, most used first, ties broken alphabetically.

```sql setup
CREATE TABLE articles (article_id int PRIMARY KEY, title text NOT NULL, tags text[] NOT NULL);
INSERT INTO articles VALUES
  (1, 'Window functions', '{sql,advanced,analytics}'), (2, 'Recursive CTEs', '{sql,advanced}'),
  (3, 'Intro to SQL', '{sql,beginner}'), (4, 'Query tuning', '{advanced,performance,sql}'),
  (5, 'Pandas basics', '{python,beginner,analytics}');
```

```sql solution
SELECT tag, count(*) AS articles
FROM articles, unnest(tags) AS tag
GROUP BY tag
ORDER BY articles DESC, tag;
```

```sql wrong
SELECT tags[1] AS tag, count(*) AS articles FROM articles GROUP BY 1 ORDER BY articles DESC, tag;
```
