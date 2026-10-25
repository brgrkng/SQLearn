---
title: Count it up
kind: drill
hints:
  - "`ON CONFLICT (day) DO UPDATE SET orders = daily_stats.orders + EXCLUDED.orders`"
---
The setup creates `daily_stats(day, orders)` with a row for **2026-01-01**. In **one statement**, record **12** more orders for 2026-01-01 (add them to the existing count) and **9** orders for **2026-01-02** (a new row).

```sql setup
CREATE TABLE daily_stats (day date PRIMARY KEY, orders int NOT NULL);
INSERT INTO daily_stats VALUES ('2026-01-01', 30);
```

```sql solution
INSERT INTO daily_stats (day, orders) VALUES ('2026-01-01', 12), ('2026-01-02', 9)
ON CONFLICT (day) DO UPDATE SET orders = daily_stats.orders + EXCLUDED.orders;
```

```sql check Final counts
SELECT day, orders FROM daily_stats;
```

```sql wrong
INSERT INTO daily_stats (day, orders) VALUES ('2026-01-01', 12), ('2026-01-02', 9)
ON CONFLICT (day) DO UPDATE SET orders = EXCLUDED.orders;
```
