---
title: Aggregation and grouping
summary: Counting, summing and averaging; GROUP BY and HAVING; conditional aggregates, pivots, medians and subtotals.
---
So far every query has returned rows that correspond to rows in a table. **Aggregate functions** collapse many rows into one value (how many, how much, how big on average), and `GROUP BY` does that once per group: per country, per month, per department.

This is the core of reporting SQL, and a large share of interview questions.
