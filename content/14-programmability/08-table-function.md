---
title: A function that returns rows
kind: drill
hints:
  - "`RETURNS TABLE (order_id int, order_date date, status text)` with a SQL body in `$$ ... $$`."
---
Create a function `recent_orders(cust int, n int)` that returns the `order_id`, `order_date` and `status` of the customer's **n most recent orders**, newest first (ties broken by higher `order_id`). Mark it `STABLE`.

```sql solution
CREATE FUNCTION recent_orders(cust int, n int)
RETURNS TABLE (order_id int, order_date date, status text)
LANGUAGE sql STABLE
AS $$
  SELECT order_id, order_date, status FROM orders
  WHERE customer_id = cust
  ORDER BY order_date DESC, order_id DESC
  LIMIT n
$$;
```

```sql check Three latest for customer 42
SELECT * FROM recent_orders(42, 3);
```

```sql check Five latest for customer 7
SELECT order_id FROM recent_orders(7, 5);
```

```sql wrong
CREATE FUNCTION recent_orders(cust int, n int)
RETURNS TABLE (order_id int, order_date date, status text)
LANGUAGE sql STABLE
AS $$
  SELECT order_id, order_date, status FROM orders
  WHERE customer_id = cust
  ORDER BY order_date, order_id
  LIMIT n
$$;
```
