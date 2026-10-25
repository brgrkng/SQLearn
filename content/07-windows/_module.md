---
title: Window functions
summary: Calculations across related rows without collapsing them. Ranking, running totals, moving averages, period-over-period changes, gaps and islands, and sessionization.
---
`GROUP BY` collapses each group into a single row. **Window functions** compute across a group of rows, called the *window*, but keep every row. You can show each employee's salary *next to* their department's average, number each customer's orders, or add a running total to a daily report.

They're the most useful tool in analytical SQL, and they come up in almost every SQL interview.
