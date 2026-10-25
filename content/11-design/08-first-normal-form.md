---
title: Tags to rows (1NF)
kind: drill
dataset: empty
hints:
  - "`unnest(string_to_array(tags, ','))` turns a comma-separated list into rows."
  - "Create `posts` and `post_tags` (with a composite primary key and a foreign key), then fill both with `INSERT ... SELECT`."
---
`posts_raw` stores tags as a comma-separated string. Normalize it into:

- `posts(post_id, title)`, with `post_id` as the primary key
- `post_tags(post_id, tag)` with one row per tag. A post can't have the same tag twice, and every row must refer to a real post.

Fill both tables from `posts_raw`. You can leave `posts_raw` in place.

```sql setup
CREATE TABLE posts_raw (post_id int, title text, tags text);
INSERT INTO posts_raw VALUES (1, 'Intro to SQL', 'sql,beginner'), (2, 'Window functions', 'sql,analytics,advanced'), (3, 'Indexing', 'performance');
```

```sql solution
CREATE TABLE posts (post_id int PRIMARY KEY, title text NOT NULL);
CREATE TABLE post_tags (post_id int REFERENCES posts, tag text NOT NULL, PRIMARY KEY (post_id, tag));
INSERT INTO posts SELECT post_id, title FROM posts_raw;
INSERT INTO post_tags SELECT post_id, unnest(string_to_array(tags, ',')) FROM posts_raw;
```

```sql check Posts
SELECT post_id, title FROM posts;
```

```sql check One row per tag
SELECT post_id, tag FROM post_tags;
```

```sql check A tag can't repeat on a post
INSERT INTO post_tags VALUES (3, 'performance');
```

```sql check Tags need a real post
INSERT INTO post_tags VALUES (99, 'sql');
```

```sql wrong
CREATE TABLE posts (post_id int PRIMARY KEY, title text NOT NULL);
CREATE TABLE post_tags (post_id int REFERENCES posts, tag text NOT NULL, PRIMARY KEY (post_id, tag));
INSERT INTO posts SELECT post_id, title FROM posts_raw;
INSERT INTO post_tags SELECT post_id, tags FROM posts_raw;
```
