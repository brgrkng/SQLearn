---
title: Quarterly report with totals
kind: problem
difficulty: hard
dataset: analytics
ordered: true
hints:
  - "`GROUP BY ROLLUP (...)` adds a total row."
  - "`grouping(...) = 1` identifies the total row, so you can label it."
---
Finance wants purchase revenue for **Q2 2025** (April to June): one row per month labelled `2025-04`, `2025-05` and `2025-06` (use `to_char(occurred_at, 'YYYY-MM')`), then a final row labelled **`Total`**. Return the label and revenue, months first in order, total last.

```sql solution
SELECT CASE WHEN grouping(to_char(occurred_at, 'YYYY-MM')) = 1 THEN 'Total' ELSE to_char(occurred_at, 'YYYY-MM') END AS period,
       sum(amount) AS revenue
FROM events
WHERE event_type = 'purchase' AND occurred_at >= '2025-04-01' AND occurred_at < '2025-07-01'
GROUP BY ROLLUP (to_char(occurred_at, 'YYYY-MM'))
ORDER BY grouping(to_char(occurred_at, 'YYYY-MM')), period;
```

```sql wrong
SELECT to_char(occurred_at, 'YYYY-MM') AS period, sum(amount) AS revenue
FROM events
WHERE event_type = 'purchase' AND occurred_at >= '2025-04-01' AND occurred_at < '2025-07-01'
GROUP BY period
ORDER BY period;
```
