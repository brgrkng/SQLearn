---
title: Who's on shift?
kind: drill
dataset: empty
hints:
  - "`during @> timestamptz '2026-03-02 13:30+00'` is true if the shift contains that moment."
---
Return the `staff` name of everyone whose shift **contains** the moment **2026-03-02 13:30 UTC**. Shifts are `[start, end)` ranges, so a shift ending at 13:30 doesn't count.

```sql setup
CREATE TABLE shifts (shift_id int PRIMARY KEY, staff text NOT NULL, during tstzrange NOT NULL);
INSERT INTO shifts VALUES
  (1, 'Ada',   '[2026-03-02 09:00+00, 2026-03-02 13:30+00)'),
  (2, 'Alan',  '[2026-03-02 13:00+00, 2026-03-02 21:00+00)'),
  (3, 'Grace', '[2026-03-02 13:30+00, 2026-03-02 17:00+00)'),
  (4, 'Linus', '[2026-03-01 21:00+00, 2026-03-02 09:00+00)');
```

```sql solution
SELECT staff FROM shifts WHERE during @> timestamptz '2026-03-02 13:30+00';
```

```sql wrong
SELECT staff FROM shifts WHERE timestamptz '2026-03-02 13:30+00' BETWEEN lower(during) AND upper(during);
```
