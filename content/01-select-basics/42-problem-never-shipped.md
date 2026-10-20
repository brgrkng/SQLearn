---
title: Stuck in the warehouse
kind: problem
difficulty: easy
ordered: true
hints:
  - Which orders *should* have shipped? Every order that wasn't cancelled.
---
Find orders that **haven't shipped** even though they **weren't cancelled**. Return `order_id`, `order_date` and `status`, oldest order first, ties broken by `order_id`.

```sql solution
SELECT order_id, order_date, status
FROM orders
WHERE shipped_date IS NULL AND status <> 'cancelled'
ORDER BY order_date, order_id;
```

```sql wrong
SELECT order_id, order_date, status
FROM orders
WHERE status = 'pending'
ORDER BY order_date, order_id;
```

```sql wrong
SELECT order_id, order_date, status
FROM orders
WHERE shipped_date IS NULL
ORDER BY order_date, order_id;
```

## Explanation
It's tempting to assume "not shipped" means `status = 'pending'`, but the data says otherwise: a few orders were marked *returned* without a shipping date ever being recorded. Querying the fact you care about (`shipped_date IS NULL`) instead of a status that is supposed to imply it often surfaces exactly these data-quality problems.
