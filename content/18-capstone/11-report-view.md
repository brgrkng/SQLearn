---
title: "Part 5: the finance view"
kind: test
dataset: bikeshare
hints:
  - "`CREATE VIEW daily_revenue AS SELECT started_at::date AS day, ... GROUP BY 1`. A plain view stays current automatically."
  - "In this database `started_at::date` gives the UTC day, which is what finance wants."
---
Finance wants to query revenue themselves. Create a view `daily_revenue` with one row per day that had trips: `day` (a `date`, the UTC day the trip started), `trips` (number of trips), `revenue` (sum of fares) and `casual_trips` (trips with no member). It must reflect new trips immediately.

```sql solution
CREATE VIEW daily_revenue AS
SELECT started_at::date AS day, count(*) AS trips, sum(fare) AS revenue,
       count(*) FILTER (WHERE member_id IS NULL) AS casual_trips
FROM trips
GROUP BY 1;
```

```sql check July in the view
SELECT day, trips, revenue, casual_trips FROM daily_revenue WHERE day >= '2025-07-01' AND day < '2025-08-01';
```

```sql check New trips show up immediately
INSERT INTO trips VALUES (999999, 1, NULL, 1, 2, '2025-07-04 12:00+00', '2025-07-04 12:30+00', 8.50);
SELECT trips, revenue, casual_trips FROM daily_revenue WHERE day = '2025-07-04';
```

```sql wrong
CREATE MATERIALIZED VIEW daily_revenue AS
SELECT started_at::date AS day, count(*) AS trips, sum(fare) AS revenue,
       count(*) FILTER (WHERE member_id IS NULL) AS casual_trips
FROM trips
GROUP BY 1;
```

```sql wrong
CREATE VIEW daily_revenue AS
SELECT started_at::date AS day, count(*) AS trips, sum(fare) AS revenue,
       count(member_id) AS casual_trips
FROM trips
GROUP BY 1;
```
