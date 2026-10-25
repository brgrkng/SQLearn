---
title: Subqueries and set operations
summary: Queries inside queries. Scalar, IN and EXISTS subqueries, correlated subqueries, LATERAL, derived tables, and UNION, INTERSECT and EXCEPT.
---
A **subquery** is a complete `SELECT` nested inside another statement. It lets you answer questions in steps: "products priced above *the average price*", "customers who have *any order in December*". Set operations combine whole result sets the way you'd combine sets in maths.
