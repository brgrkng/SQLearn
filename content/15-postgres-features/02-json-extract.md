---
title: Read the payload
kind: drill
dataset: empty
hints:
  - "`payload ->> 'type'` gives text. `payload -> 'user' ->> 'country'` goes one level down."
  - "Cast before comparing numbers: `(payload ->> 'amount')::numeric`."
---
Return the `webhook_id`, the customer's **country** (from `customer.country`) and the **amount** (as a number) of every webhook of type `charge` with an amount **over 20**.

```sql setup
CREATE TABLE webhooks (webhook_id int PRIMARY KEY, payload jsonb NOT NULL);
INSERT INTO webhooks VALUES
  (1, '{"type": "charge", "amount": 45.00, "customer": {"id": 1, "country": "GB"}}'),
  (2, '{"type": "refund", "amount": 45.00, "customer": {"id": 1, "country": "GB"}}'),
  (3, '{"type": "charge", "amount": 9.99, "customer": {"id": 2, "country": "DE"}}'),
  (4, '{"type": "charge", "amount": 120, "customer": {"id": 3, "country": "US"}}'),
  (5, '{"type": "charge", "amount": 100, "customer": {"id": 4}}');
```

```sql solution
SELECT webhook_id, payload -> 'customer' ->> 'country' AS country, (payload ->> 'amount')::numeric AS amount
FROM webhooks
WHERE payload ->> 'type' = 'charge' AND (payload ->> 'amount')::numeric > 20;
```

```sql wrong
SELECT webhook_id, payload -> 'customer' ->> 'country' AS country, (payload ->> 'amount')::numeric AS amount
FROM webhooks
WHERE payload ->> 'type' = 'charge' AND payload ->> 'amount' > '20';
```

## Explanation
`payload ->> 'amount'` is **text**, and text compares character by character: `'100' > '20'` is false because `'1' < '2'`. Cast JSON numbers before comparing them.
