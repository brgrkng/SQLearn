---
title: What does a query cost?
kind: lesson
---
Two queries can return exactly the same rows while one of them does a thousand times more work. On a 50,000-row table you might not notice. On a 50-million-row table, the slow one takes your application down. From here on, every exercise is graded on **efficiency** as well as correctness, so let's look at how efficiency is measured.

## The planner

When you send a query, PostgreSQL:

1. **parses** it, checking the syntax and that the tables and columns exist;
2. **plans** it, considering the different ways it could fetch the data and estimating the **cost** of each;
3. **executes** the cheapest plan it found.

Cost is an estimate in arbitrary units, roughly "pages read from disk". Reading one page in order costs 1, and handling each row adds a little more. It isn't milliseconds, but it scales the way real work scales, and unlike a stopwatch it gives the same number every time. That's why it's used for grading.

`EXPLAIN` shows the plan without running the query:

```sql
EXPLAIN SELECT * FROM orders WHERE order_id = 32000;
```

```sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
```

The first plan is an **Index Scan** with a cost of about 8. The second is a **Seq Scan** (sequential scan) costing about 1,000: it reads all 50,000 orders and checks each one.

## Indexes, in one paragraph

An **index** is a separate, sorted structure that maps column values to the rows that hold them, like the index at the back of a book. PostgreSQL creates one automatically for every **primary key** and **UNIQUE** constraint. In the shop that covers `orders.order_id`, `customers.customer_id`, `customers.email` and so on. Nobody has created one for `orders.customer_id`, so that lookup has to read the whole table. The indexes module covers creating them. For now, it's enough to know which ones exist and to write queries that can use them.

## Write conditions the index can use

An index on `order_id` stores `order_id` values. It doesn't store `order_id - 1`, `order_id::text` or `lower(email)`. When you wrap the column in an expression, the index can't help:

```sql
EXPLAIN SELECT * FROM orders WHERE order_id - 1 = 31999;
```

Same answer as `order_id = 32000`, but a cost above 1,000 instead of 8. The rule: **leave the indexed column bare on one side of the comparison and put the arithmetic on the other side.** A condition the index can use is called **sargable** (from "Search ARGument ABLE").

```sql
EXPLAIN SELECT * FROM customers WHERE email = 'mateo.wilson2718@example.com';
```

```sql
EXPLAIN SELECT * FROM customers WHERE lower(email) = 'mateo.wilson2718@example.com';
```

## LIMIT can stop early, and OFFSET can't skip for free

With `ORDER BY order_id LIMIT 20`, PostgreSQL walks the primary-key index in order and stops after 20 rows. `OFFSET 45000` makes it walk and discard 45,000 rows first:

```sql
EXPLAIN SELECT order_id, order_date FROM orders ORDER BY order_id LIMIT 20 OFFSET 45000;
```

If you know the last row the user saw, start right after it. This is **keyset pagination**:

```sql
EXPLAIN SELECT order_id, order_date FROM orders WHERE order_id > 45000 ORDER BY order_id LIMIT 20;
```

That's a cost of about 1 instead of about 1,500, and it stays fast however deep you page.

## How grading uses cost

When you **Submit**, the grader runs `EXPLAIN` on your query and on the reference solution. You pass the efficiency check if your cost is within **2×** the reference (plus a small allowance, so tiny tables never fail on noise). The meter on the result shows both numbers. **Run** also prints your query's estimated cost, so you can experiment before submitting.

> **Dialect note.** Every major database has a cost-based planner and a way to show plans: `EXPLAIN` in MySQL (`EXPLAIN ANALYZE` from 8.0), *Display Estimated Execution Plan* or `SET SHOWPLAN_ALL ON` in SQL Server, and `EXPLAIN PLAN FOR` in Oracle. The cost units differ between them, but the habits in this lesson carry over to all of them.
