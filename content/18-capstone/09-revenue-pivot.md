---
title: "Part 3f: revenue by month"
kind: test
dataset: bikeshare
ordered: true
---
Finance wants monthly revenue split by rider type. For each month (first day, as a `date`), return total fare revenue, revenue from **casual** riders, revenue from **members**, and casual riders' share of revenue as a percentage rounded to 1 decimal place. In month order.

```sql solution
SELECT date_trunc('month', started_at)::date AS month,
       sum(fare) AS revenue,
       sum(fare) FILTER (WHERE member_id IS NULL) AS casual_revenue,
       sum(fare) FILTER (WHERE member_id IS NOT NULL) AS member_revenue,
       round(100 * sum(fare) FILTER (WHERE member_id IS NULL) / sum(fare), 1) AS casual_pct
FROM trips
GROUP BY 1
ORDER BY 1;
```

```sql wrong
SELECT date_trunc('month', started_at)::date AS month,
       sum(fare) AS revenue,
       sum(fare) FILTER (WHERE member_id IS NULL) AS casual_revenue,
       sum(fare) FILTER (WHERE member_id IS NOT NULL) AS member_revenue,
       round(100.0 * count(*) FILTER (WHERE member_id IS NULL) / count(*), 1) AS casual_pct
FROM trips
GROUP BY 1
ORDER BY 1;
```
