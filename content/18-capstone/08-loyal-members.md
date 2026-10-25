---
title: "Part 3e: summer regulars"
kind: test
dataset: bikeshare
hints:
  - "Count the distinct months (July, August, September) in which each member rode, and keep members with all three."
---
Marketing wants to thank **summer regulars**: members who took at least one trip in **each** of July, August and September 2025. How many members is that, and what percentage of all members who rode at least once during those three months? Return the two numbers, with the percentage rounded to 1 decimal place.

```sql solution
WITH monthly AS (
  SELECT member_id, count(DISTINCT date_trunc('month', started_at)) AS months
  FROM trips
  WHERE member_id IS NOT NULL AND started_at >= '2025-07-01' AND started_at < '2025-10-01'
  GROUP BY member_id
)
SELECT count(*) FILTER (WHERE months = 3) AS regulars,
       round(100.0 * count(*) FILTER (WHERE months = 3) / count(*), 1) AS pct_of_summer_riders
FROM monthly;
```

```sql wrong
WITH monthly AS (
  SELECT member_id, count(*) AS months
  FROM trips
  WHERE member_id IS NOT NULL AND started_at >= '2025-07-01' AND started_at < '2025-10-01'
  GROUP BY member_id
)
SELECT count(*) FILTER (WHERE months >= 3) AS regulars,
       round(100.0 * count(*) FILTER (WHERE months >= 3) / count(*), 1) AS pct_of_summer_riders
FROM monthly;
```
