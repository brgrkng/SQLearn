---
title: Authors and books
kind: drill
dataset: empty
hints:
  - "One author, many books: the foreign key goes on `books`."
---
Design two tables: `authors(author_id, name)` and `books(book_id, title, author_id)`. Every book has **exactly one** author, and an author can have many books. A book can't reference an author who doesn't exist. Names and titles are required. Use integer ids.

```sql solution
CREATE TABLE authors (author_id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE books (book_id int PRIMARY KEY, title text NOT NULL, author_id int NOT NULL REFERENCES authors);
```

```sql check An author with several books
INSERT INTO authors VALUES (1, 'Ursula K. Le Guin');
INSERT INTO books VALUES (10, 'A Wizard of Earthsea', 1), (11, 'The Dispossessed', 1);
SELECT count(*) FROM books WHERE author_id = 1;
```

```sql check A book needs an author
INSERT INTO books VALUES (12, 'Anonymous', NULL);
```

```sql check The author must exist
INSERT INTO books VALUES (13, 'Ghost Writer', 99);
```

```sql check Duplicate book ids are rejected
INSERT INTO authors VALUES (2, 'Octavia Butler');
INSERT INTO books VALUES (20, 'Kindred', 2), (20, 'Dawn', 2);
```

```sql wrong
CREATE TABLE authors (author_id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE books (book_id int PRIMARY KEY, title text NOT NULL, author_id int REFERENCES authors);
```

```sql wrong
CREATE TABLE books (book_id int PRIMARY KEY, title text NOT NULL, author_id int NOT NULL);
CREATE TABLE authors (author_id int PRIMARY KEY, name text NOT NULL);
```
