---
title: Tables, rows and your first query
kind: lesson
---
A **relational database** stores data in **tables**. A table is a named set of **rows**, and every row has the same **columns**. Here is a slice of the `products` table from the shop:

| product_id | name | category_id | price | stock | discontinued |
|---|---|---|---|---|---|
| 5 | Orbit Bluetooth Speaker | 7 | 49.99 | 206 | false |
| 83 | Lumen Tripod | 10 | 49.99 | 207 | false |
| 301 | Orbit Bike Helmet | 19 | 49.99 | 0 | true |

Three ideas carry the rest of the course:

- **Every column has a type.** `price` is `numeric(10,2)`, an exact decimal with two digits after the point. `discontinued` is a `boolean`, and `added_on` is a `date`. The database rejects a value that doesn't fit the type.
- **Rows have no inherent order.** A table is a *set* of rows, not a list. If you need an order, you have to ask for one with `ORDER BY`, covered later in this module.
- **Rows are identified by a key.** `product_id` is the table's **primary key**: unique, never empty, and the way other tables refer to a product. The `orders` table, for example, stores a `customer_id` instead of copying the customer's name onto every order.

## Asking a question

SQL is **declarative**: you describe *what* you want and the database works out *how* to get it. Every example on these pages is a live editor connected to a real PostgreSQL database running in your browser. Press **Run** (or Ctrl+Enter):

```sql
SELECT * FROM products LIMIT 5;
```

`SELECT *` means "all columns", `FROM products` names the table, and `LIMIT 5` stops after five rows. Edit the query and run it again. Try `customers` or `orders` instead of `products`. Nothing you do here can damage anything, because each run gets a fresh copy of the database.

## The shop

| Table | What a row is |
|---|---|
| `categories` | A product category. `parent_id` points at a parent category (Laptops → Computers → Electronics). |
| `products` | Something for sale, with its current `price` and `stock`. |
| `customers` | A registered customer. `email`, `city` and `loyalty_tier` may be missing. |
| `orders` | One checkout by one customer, with a `status`. `shipped_date` is empty until it ships. |
| `order_items` | One line of an order: which product, how many, at what `unit_price`. |

## How this course works

Each module has **lessons** like this one, short **drills** that practise one idea at a time, a **test** that mixes everything in the module, and **problems** written in the style of interview questions.

Exercises are graded automatically on two things:

1. **Correct:** your query returns the same rows as the reference solution. Column names don't matter unless the task says so, and row order only matters when the task asks for a specific order.
2. **Efficient:** PostgreSQL estimates the **cost** of running your query. A query that gives the right answer but costs far more than necessary (by default more than twice the reference solution's cost) doesn't pass. You'll learn to read and reduce cost at the end of this module, and the topic comes back in every module after that.

**Run** shows your output without grading. **Submit** grades it.

> **Dialect note.** This course teaches PostgreSQL. Most of what you learn transfers directly to MySQL, SQL Server, Oracle and SQLite. Where they differ, a note like this one tells you how.
