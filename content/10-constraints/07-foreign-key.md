---
title: No orphan comments
kind: drill
dataset: empty
hints:
  - "`post_id int NOT NULL REFERENCES posts (post_id)`"
---
The setup creates `posts`. Create `comments` with `comment_id` (`int`, primary key), `post_id` (required, must refer to an existing post) and `body` (required `text`). Deleting a post that has comments must **fail**.

```sql setup
CREATE TABLE posts (post_id int PRIMARY KEY, title text NOT NULL);
INSERT INTO posts VALUES (1, 'Hello'), (2, 'Second post');
```

```sql solution
CREATE TABLE comments (
  comment_id int PRIMARY KEY,
  post_id    int NOT NULL REFERENCES posts (post_id),
  body       text NOT NULL
);
```

```sql check Comments on real posts are accepted
INSERT INTO comments VALUES (1, 1, 'Nice'), (2, 1, 'Agreed'), (3, 2, 'First!') RETURNING comment_id;
```

```sql check Comments on missing posts are rejected
INSERT INTO comments VALUES (4, 99, 'Hello?');
```

```sql check A post with comments can't be deleted
INSERT INTO comments VALUES (5, 2, 'x');
DELETE FROM posts WHERE post_id = 2;
```

```sql wrong
CREATE TABLE comments (comment_id int PRIMARY KEY, post_id int NOT NULL, body text NOT NULL);
```

```sql wrong
CREATE TABLE comments (
  comment_id int PRIMARY KEY,
  post_id    int NOT NULL REFERENCES posts (post_id) ON DELETE CASCADE,
  body       text NOT NULL
);
```
