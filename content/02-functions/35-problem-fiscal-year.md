---
title: Fiscal quarters
kind: problem
difficulty: hard
hints:
  - The fiscal year starts 9 months "early". What happens if you shift each date forward 9 months?
  - "`extract(year FROM d + interval '9 months')`"
---
The shop's fiscal year runs **1 April to 31 March** and is named after the calendar year it **ends** in: April 2024 to March 2025 is `FY2025`. Fiscal Q1 is April to June.

For orders placed on the **1st of any month in 2024**, return `order_id`, `order_date`, the fiscal year label (e.g. `FY2025`) and the fiscal quarter label (e.g. `Q1`).

```sql solution
SELECT order_id, order_date,
       'FY' || extract(year FROM order_date + interval '9 months') AS fiscal_year,
       'Q' || extract(quarter FROM order_date + interval '9 months') AS fiscal_quarter
FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01' AND extract(day FROM order_date) = 1;
```

```sql wrong
SELECT order_id, order_date,
       'FY' || extract(year FROM order_date + interval '3 months') AS fiscal_year,
       'Q' || extract(quarter FROM order_date + interval '3 months') AS fiscal_quarter
FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01' AND extract(day FROM order_date) = 1;
```

```sql wrong
SELECT order_id, order_date,
       'FY' || extract(year FROM order_date) AS fiscal_year,
       'Q' || extract(quarter FROM order_date + interval '9 months') AS fiscal_quarter
FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01' AND extract(day FROM order_date) = 1;
```

## Explanation
Shifting every date forward by the fiscal offset (9 months) lines the fiscal calendar up with the ordinary one: 1 April 2024 becomes 1 January 2025, so its calendar year (2025) and quarter (1) are exactly the fiscal year and quarter. The same trick works for any fiscal calendar that starts on the first of a month.
