---
title: Likes on posts or photos
kind: drill
dataset: empty
hints:
  - "One nullable foreign key per target, plus `CHECK (num_nonnulls(post_id, photo_id) = 1)`."
---
The setup creates `posts` and `photos`. Create `likes(like_id, user_name, post_id, photo_id)`. Each like is on **exactly one** thing, either a post or a photo, and that thing must exist. Use real foreign keys, not a "type + id" pair.

```sql setup
CREATE TABLE posts (post_id int PRIMARY KEY);
CREATE TABLE photos (photo_id int PRIMARY KEY);
INSERT INTO posts VALUES (1), (2);
INSERT INTO photos VALUES (10), (11);
```

```sql solution
CREATE TABLE likes (
  like_id   int PRIMARY KEY,
  user_name text NOT NULL,
  post_id   int REFERENCES posts,
  photo_id  int REFERENCES photos,
  CHECK (num_nonnulls(post_id, photo_id) = 1)
);
```

```sql check Likes on a post or on a photo
INSERT INTO likes VALUES (1, 'ada', 1, NULL), (2, 'alan', NULL, 10) RETURNING like_id;
```

```sql check Not both
INSERT INTO likes VALUES (3, 'grace', 1, 10);
```

```sql check Not neither
INSERT INTO likes VALUES (4, 'grace', NULL, NULL);
```

```sql check Targets must exist
INSERT INTO likes VALUES (5, 'grace', NULL, 99);
```

```sql wrong
CREATE TABLE likes (like_id int PRIMARY KEY, user_name text NOT NULL, post_id int REFERENCES posts, photo_id int REFERENCES photos);
```
