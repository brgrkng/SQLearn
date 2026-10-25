---
title: Keep the history
kind: problem
difficulty: hard
dataset: empty
hints:
  - Two changes in one statement, using a data-modifying CTE.
  - "Close the current row (`valid_to = '2026-03-01'`) in a CTE with `RETURNING`, then insert the new row."
---
`customer_tiers` keeps **history**. Each customer has rows with `valid_from` and `valid_to`, and their current row has `valid_to` NULL. Customer **7** moves to tier **`gold`** on **2026-03-01**.

In **one statement**, close their current row (set its `valid_to` to 2026-03-01) and insert a new current row (`gold`, valid from 2026-03-01, `valid_to` NULL). Customers other than 7 must not change.

```sql setup
CREATE TABLE customer_tiers (customer_id int, tier text NOT NULL, valid_from date NOT NULL, valid_to date,
                             PRIMARY KEY (customer_id, valid_from));
INSERT INTO customer_tiers VALUES
  (7, 'bronze', '2024-01-01', '2025-02-01'), (7, 'silver', '2025-02-01', NULL),
  (8, 'silver', '2025-05-01', NULL);
```

```sql solution
WITH closed AS (
  UPDATE customer_tiers SET valid_to = '2026-03-01'
  WHERE customer_id = 7 AND valid_to IS NULL
  RETURNING customer_id
)
INSERT INTO customer_tiers (customer_id, tier, valid_from, valid_to)
SELECT customer_id, 'gold', '2026-03-01', NULL FROM closed;
```

```sql check Full history
SELECT customer_id, tier, valid_from, valid_to FROM customer_tiers;
```

```sql wrong
UPDATE customer_tiers SET tier = 'gold', valid_from = '2026-03-01'
WHERE customer_id = 7 AND valid_to IS NULL;
```

## Explanation
This is a *slowly changing dimension, type 2*: instead of overwriting the tier, you end the old row and start a new one, so you can always ask "what tier was customer 7 on 2025-06-01?". Doing both changes in one statement means nobody can ever see the customer with zero current rows or two.
