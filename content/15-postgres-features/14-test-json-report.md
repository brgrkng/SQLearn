---
title: Revenue from raw events
kind: test
dataset: empty
---
Each row of `raw_events` holds a JSON event. For **purchase** events, sum `quantity × price` over every element of `lines`, grouped by the event's `country`. Return `country` and revenue, highest first.

```sql setup
CREATE TABLE raw_events (id int PRIMARY KEY, body jsonb NOT NULL);
INSERT INTO raw_events VALUES
  (1, '{"kind": "purchase", "country": "GB", "lines": [{"quantity": 2, "price": 10}, {"quantity": 1, "price": 5.5}]}'),
  (2, '{"kind": "purchase", "country": "DE", "lines": [{"quantity": 3, "price": 20}]}'),
  (3, '{"kind": "view", "country": "GB"}'),
  (4, '{"kind": "purchase", "country": "GB", "lines": [{"quantity": 1, "price": 100}]}'),
  (5, '{"kind": "purchase", "country": "FR", "lines": []}');
```

```sql solution
SELECT e.body ->> 'country' AS country, sum((l ->> 'quantity')::numeric * (l ->> 'price')::numeric) AS revenue
FROM raw_events e, jsonb_array_elements(e.body -> 'lines') AS l
WHERE e.body ->> 'kind' = 'purchase'
GROUP BY 1
ORDER BY revenue DESC;
```

```sql wrong
SELECT e.body ->> 'country' AS country, sum((l ->> 'price')::numeric) AS revenue
FROM raw_events e, jsonb_array_elements(e.body -> 'lines') AS l
WHERE e.body ->> 'kind' = 'purchase'
GROUP BY 1
ORDER BY revenue DESC;
```
