---
title: Blog schema rules
kind: test
dataset: empty
---
The setup creates `authors`. Create:

- `posts (post_id int PK, author_id, title text NOT NULL)`: `author_id` is required. Deleting an author who has posts must **fail**.
- `comments (comment_id int PK, post_id, commenter_id, body text NOT NULL)`: `post_id` is required, and deleting a post **deletes its comments**. `commenter_id` is optional and refers to `authors`. Deleting that author **keeps the comment** with `commenter_id` set to NULL.

```sql setup
CREATE TABLE authors (author_id int PRIMARY KEY, name text NOT NULL);
INSERT INTO authors VALUES (1, 'Ada'), (2, 'Alan'), (3, 'Grace');
```

```sql solution
CREATE TABLE posts (
  post_id   int PRIMARY KEY,
  author_id int NOT NULL REFERENCES authors,
  title     text NOT NULL
);
CREATE TABLE comments (
  comment_id   int PRIMARY KEY,
  post_id      int NOT NULL REFERENCES posts ON DELETE CASCADE,
  commenter_id int REFERENCES authors ON DELETE SET NULL,
  body         text NOT NULL
);
```

```sql check Deleting a post deletes its comments
INSERT INTO posts VALUES (10, 1, 'Hello'), (11, 2, 'World');
INSERT INTO comments VALUES (100, 10, 2, 'Hi'), (101, 10, 3, 'Yo'), (102, 11, 3, 'Hey');
DELETE FROM posts WHERE post_id = 10;
SELECT comment_id FROM comments;
```

```sql check Deleting a commenter keeps their comments
INSERT INTO posts VALUES (12, 1, 'Again');
INSERT INTO comments VALUES (103, 12, 3, 'Me again');
DELETE FROM authors WHERE author_id = 3;
SELECT comment_id, commenter_id FROM comments;
```

```sql check An author with posts can't be deleted
INSERT INTO posts VALUES (13, 2, 'Mine');
DELETE FROM authors WHERE author_id = 2;
```

```sql wrong
CREATE TABLE posts (
  post_id   int PRIMARY KEY,
  author_id int NOT NULL REFERENCES authors ON DELETE CASCADE,
  title     text NOT NULL
);
CREATE TABLE comments (
  comment_id   int PRIMARY KEY,
  post_id      int NOT NULL REFERENCES posts ON DELETE CASCADE,
  commenter_id int REFERENCES authors ON DELETE SET NULL,
  body         text NOT NULL
);
```

```sql wrong
CREATE TABLE posts (
  post_id   int PRIMARY KEY,
  author_id int NOT NULL REFERENCES authors,
  title     text NOT NULL
);
CREATE TABLE comments (
  comment_id   int PRIMARY KEY,
  post_id      int NOT NULL REFERENCES posts,
  commenter_id int REFERENCES authors,
  body         text NOT NULL
);
```
