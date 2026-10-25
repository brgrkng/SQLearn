---
title: Recent purchases feed
kind: test
dataset: analytics
costSlack: 10
---
The finance feed lists the time and amount of June purchases, in time order. Create **one** index that lets PostgreSQL answer it with an index-only scan.

```sql norun
SELECT occurred_at, amount FROM events
WHERE event_type = 'purchase' AND occurred_at >= '2025-06-01'
ORDER BY occurred_at;
```

```sql solution
CREATE INDEX events_purchase_feed_idx ON events (event_type, occurred_at) INCLUDE (amount);
```

```sql explain
SELECT occurred_at, amount FROM events
WHERE event_type = 'purchase' AND occurred_at >= '2025-06-01'
ORDER BY occurred_at;
```

```sql wrong
CREATE INDEX events_type_time_idx ON events (event_type, occurred_at);
```

```sql wrong
CREATE INDEX events_type_idx ON events (event_type) INCLUDE (occurred_at, amount);
```

```sql wrong
CREATE INDEX events_time_type_idx ON events (occurred_at, event_type) INCLUDE (amount);
```
