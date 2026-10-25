---
title: Archive returned orders
kind: drill
hints:
  - "`INSERT INTO returned_2023 (...) SELECT ... FROM orders WHERE ...`"
---
The setup creates an empty table `returned_2023`. Fill it with every order that was **returned** and placed in **2023**: its `order_id`, `customer_id` and `order_date`.

```sql setup
CREATE TABLE returned_2023 (order_id int PRIMARY KEY, customer_id int NOT NULL, order_date date NOT NULL);
```

```sql solution
INSERT INTO returned_2023 (order_id, customer_id, order_date)
SELECT order_id, customer_id, order_date
FROM orders
WHERE status = 'returned' AND order_date >= '2023-01-01' AND order_date < '2024-01-01';
```

```sql check The archive holds exactly the right orders
SELECT order_id, customer_id, order_date FROM returned_2023;
```

```sql wrong
INSERT INTO returned_2023 (order_id, customer_id, order_date)
SELECT order_id, customer_id, order_date
FROM orders
WHERE status IN ('returned', 'cancelled') AND order_date >= '2023-01-01' AND order_date < '2024-01-01';
```
