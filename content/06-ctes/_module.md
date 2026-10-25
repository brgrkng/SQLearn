---
title: Common table expressions
summary: Naming the steps of a query with WITH, and walking hierarchies of any depth with recursive CTEs.
---
A **common table expression** (CTE) is a named subquery defined at the top of a statement with `WITH`. It turns an inside-out tangle of nested subqueries into a sequence of named steps you can read from top to bottom. **Recursive** CTEs go further: they can follow parent/child links to any depth. That's how you query org charts, category trees, threads and graphs.
