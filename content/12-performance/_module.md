---
title: Indexes and query performance
summary: How B-tree indexes work, reading EXPLAIN plans, composite, covering, partial and expression indexes, when indexes don't help, and a workflow for tuning slow queries.
---
You've been reading plan costs since Module 1. This module explains what's behind them, and how to change them. Most "the database is slow" problems come down to a missing or wrong index, or a query written so that an index can't help.

Many exercises here are graded **on cost alone**. A fixed query is measured with `EXPLAIN` after your SQL runs, and you pass by making it cheap, usually by creating the right index. Creating an index never changes a query's results, only how fast it runs.
