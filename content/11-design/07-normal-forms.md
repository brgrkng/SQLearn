---
title: Normalization, 1NF to BCNF
kind: lesson
dataset: empty
cumulative: true
---
Normalization is a systematic way to remove redundancy. It's built on one idea.

## Functional dependencies

`A → B` ("A determines B") means that whenever two rows agree on A, they must agree on B. In an orders table, `customer_email → customer_name`: one email, one name. `sku → product_name`. Finding the real-world dependencies is the analysis. The normal forms are rules about where those dependencies are allowed to live.

## First normal form (1NF): one value per cell

Every column holds a single, atomic value, and there are no repeating groups such as `phone1, phone2, phone3`, or a comma-separated list.

```sql
CREATE TABLE posts_unnormalized (post_id int PRIMARY KEY, title text, tags text);
INSERT INTO posts_unnormalized VALUES (1, 'Intro to SQL', 'sql,beginner'), (2, 'Window functions', 'sql,analytics,advanced');
-- "Which posts are tagged sql?" means string matching, and tags can't have constraints or a lookup table
SELECT post_id FROM posts_unnormalized WHERE ',' || tags || ',' LIKE '%,sql,%';
```

The 1NF version stores one row per (post, tag):

```sql
CREATE TABLE post_tags (post_id int REFERENCES posts_unnormalized, tag text, PRIMARY KEY (post_id, tag));
INSERT INTO post_tags
SELECT post_id, unnest(string_to_array(tags, ',')) FROM posts_unnormalized;
SELECT * FROM post_tags ORDER BY post_id, tag;
```

(PostgreSQL's arrays and `jsonb` do let a column hold structure. They're the right tool sometimes, see Module 15, but not for data you need to constrain, join and query on its own.)

## Second normal form (2NF): depend on the whole key

2NF only matters for tables with a **composite** key. Every non-key column must depend on the **entire** key, not just part of it.

`order_lines(order_id, sku, quantity, product_name)` has key `(order_id, sku)`. `quantity` depends on both: how many of *this* product on *this* order. But `product_name` depends on `sku` alone, a **partial dependency**, so it's repeated on every line that sells that product. The fix is to move it to a `products(sku, product_name)` table.

## Third normal form (3NF): depend on nothing but the key

No non-key column may depend on another non-key column (a **transitive dependency**).

`employees(employee_id, name, department_id, department_name)`: `department_name` depends on `department_id`, which depends on the key. Every employee in a department repeats its name, so renaming the department means updating many rows. The fix is to move it to `departments(department_id, department_name)`.

A classic summary of 1NF to 3NF: every non-key attribute must depend on **the key, the whole key, and nothing but the key**.

## Boyce–Codd normal form (BCNF)

BCNF tightens 3NF: for every dependency `A → B`, A must be a candidate key. The cases where 3NF and BCNF differ involve overlapping candidate keys, and they're rare. A textbook example: `(student, course, tutor)` where each tutor teaches exactly one course (`tutor → course`) but `tutor` isn't a key. Splitting into `(student, tutor)` and `(tutor, course)` removes the redundancy.

**4NF** deals with independent multi-valued facts stored in one table, such as an employee's skills and their languages in a single `(employee, skill, language)` table. Split them into separate tables.

## In practice

Aim for **3NF/BCNF by default**. It falls out naturally if you give each entity its own table and each relationship its own key. Then denormalize deliberately where measurements show you need to, which is the next lesson.

> **Dialect note.** Normal forms are relational theory and apply to every SQL database. Document stores (MongoDB etc.) encourage denormalized designs on purpose, trading update anomalies for read locality. The trade-off is the same one you'll weigh in the next lesson.
