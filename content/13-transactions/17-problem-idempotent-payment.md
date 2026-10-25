---
title: Pay exactly once
kind: problem
difficulty: hard
dataset: empty
hints:
  - "`INSERT ... ON CONFLICT (idempotency_key) DO NOTHING RETURNING ...` returns a row only when the payment is new."
  - "Put it in a data-modifying CTE, and UPDATE the order only `WHERE EXISTS (SELECT 1 FROM inserted)`."
---
A payment webhook may be delivered **more than once**. Each delivery carries an idempotency key. Write **one statement** that records payment `evt_42` of **$80** for order **7**, and adds $80 to the order's `paid` total, but only if this key hasn't been recorded before. The setup has already processed key `evt_41`. **Run your statement twice** (paste it two times) to prove the second delivery changes nothing.

```sql setup
CREATE TABLE orders (order_id int PRIMARY KEY, total numeric(10,2) NOT NULL, paid numeric(10,2) NOT NULL DEFAULT 0);
INSERT INTO orders VALUES (7, 200, 50);
CREATE TABLE payments (idempotency_key text PRIMARY KEY, order_id int NOT NULL REFERENCES orders, amount numeric(10,2) NOT NULL);
INSERT INTO payments VALUES ('evt_41', 7, 50);
```

```sql solution
WITH inserted AS (
  INSERT INTO payments VALUES ('evt_42', 7, 80)
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING order_id, amount
)
UPDATE orders o SET paid = o.paid + i.amount FROM inserted i WHERE o.order_id = i.order_id;

WITH inserted AS (
  INSERT INTO payments VALUES ('evt_42', 7, 80)
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING order_id, amount
)
UPDATE orders o SET paid = o.paid + i.amount FROM inserted i WHERE o.order_id = i.order_id;
```

```sql check Order totals
SELECT order_id, paid FROM orders;
```

```sql check Payments recorded once
SELECT idempotency_key, amount FROM payments;
```

```sql wrong
INSERT INTO payments VALUES ('evt_42', 7, 80) ON CONFLICT (idempotency_key) DO NOTHING;
UPDATE orders SET paid = paid + 80 WHERE order_id = 7;
INSERT INTO payments VALUES ('evt_42', 7, 80) ON CONFLICT (idempotency_key) DO NOTHING;
UPDATE orders SET paid = paid + 80 WHERE order_id = 7;
```
