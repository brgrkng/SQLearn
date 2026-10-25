---
title: Order codes
kind: drill
columnNames: true
hints:
  - "`lpad(text, width, fill)` pads on the left. Cast the number to text first: `order_id::text`."
---
Invoices show orders as `ORD-` followed by the order number padded with zeros to **6 digits** (`ORD-000042`). For orders placed on **2025-06-01**, return `order_id` and the code in a column named **code**.

```sql starter
SELECT order_id
FROM orders
WHERE order_date = '2025-06-01';
```

```sql solution
SELECT order_id, 'ORD-' || lpad(order_id::text, 6, '0') AS code
FROM orders
WHERE order_date = '2025-06-01';
```

```sql wrong
SELECT order_id, 'ORD-' || lpad(order_id::text, 5, '0') AS code
FROM orders
WHERE order_date = '2025-06-01';
```
