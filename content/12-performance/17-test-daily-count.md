---
title: A query you can't change
kind: test
dataset: analytics
costSlack: 10
---
A vendor dashboard sends this query, and you can't change it. Make it fast anyway.

```sql norun
SELECT count(*) FROM events WHERE date_trunc('day', occurred_at) = '2025-06-15';
```

```sql solution
CREATE INDEX events_day_idx ON events (date_trunc('day', occurred_at));
ANALYZE events;
```

```sql explain
SELECT count(*) FROM events WHERE date_trunc('day', occurred_at) = '2025-06-15';
```

```sql wrong
CREATE INDEX events_occurred_idx ON events (occurred_at);
ANALYZE events;
```
