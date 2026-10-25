---
title: A table for books
kind: drill
dataset: empty
hints:
  - "`CREATE TABLE books (book_id int PRIMARY KEY, title text NOT NULL, ...)`"
---
Create a table `books` with these columns:

| column | type | rules |
|---|---|---|
| `book_id` | `integer` | primary key |
| `title` | `text` | required |
| `published` | `date` | optional |
| `price` | `numeric(8,2)` | optional |

```sql solution
CREATE TABLE books (
  book_id   int PRIMARY KEY,
  title     text NOT NULL,
  published date,
  price     numeric(8,2)
);
```

```sql check Columns and types
SELECT column_name, data_type, is_nullable, numeric_precision, numeric_scale
FROM information_schema.columns WHERE table_name = 'books';
```

```sql check A book without a title is rejected
INSERT INTO books (book_id, title) VALUES (1, NULL);
```

```sql check Duplicate ids are rejected
INSERT INTO books (book_id, title) VALUES (2, 'A'), (2, 'B');
```

```sql check Prices keep two decimals
INSERT INTO books (book_id, title, price) VALUES (3, 'C', 12.345) RETURNING price;
```

```sql wrong
CREATE TABLE books (book_id int PRIMARY KEY, title text, published date, price numeric(8,2));
```

```sql wrong
CREATE TABLE books (book_id int PRIMARY KEY, title text NOT NULL, published date, price real);
```
