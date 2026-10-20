---
title: Querying a single table
summary: SELECT, filtering, NULL, sorting, DISTINCT, and your first look at what makes a query cheap or expensive.
---
Everything in SQL builds on one statement: `SELECT`. This module covers reading from a single table: which columns, which rows, in what order. It also teaches the habit the rest of the course relies on, which is asking how much a query costs as well as whether its answer is right.

All examples use **shop**, an online store with 5,000 customers, 50,000 orders and about 125,000 order lines. Open *Database tables* on any exercise to see its columns.
