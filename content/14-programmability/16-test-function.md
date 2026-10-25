---
title: Working days between dates
kind: test
dataset: empty
---
Create an `IMMUTABLE` SQL function `working_days(from_day date, to_day date)` returning the number of **weekdays** (Monday to Friday) from `from_day` up to and including `to_day`.

```sql solution
CREATE FUNCTION working_days(from_day date, to_day date) RETURNS int
LANGUAGE sql IMMUTABLE
RETURN (SELECT count(*)::int FROM generate_series(from_day, to_day, interval '1 day') d
        WHERE extract(isodow FROM d) < 6);
```

```sql check A full week
SELECT working_days('2026-03-02', '2026-03-08');
```

```sql check Across a weekend
SELECT working_days('2026-03-06', '2026-03-09');
```

```sql check One Saturday
SELECT working_days('2026-03-07', '2026-03-07');
```

```sql check A whole month
SELECT working_days('2026-02-01', '2026-02-28');
```

```sql wrong
CREATE FUNCTION working_days(from_day date, to_day date) RETURNS int
LANGUAGE sql IMMUTABLE
RETURN to_day - from_day;
```
