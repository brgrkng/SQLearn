---
title: Category growth league table
kind: problem
difficulty: hard
ordered: true
hints:
  - Revenue per top-level category and year. Every category rolls up to a root through `parent_id`, at most three levels deep.
  - Pivot 2024 and 2025 into columns, compute growth, then `rank()` by growth.
---
For each **top-level** category (no parent), compare revenue (`quantity × unit_price`, excluding cancelled orders) in **2025** with **2024**. Products in subcategories count towards their top-level category. Return the category `name`, 2024 revenue, 2025 revenue, growth as a percentage rounded to 1 decimal place, and a `rank` by growth (1 = fastest growing). Sort by rank, then name.

```sql solution
WITH RECURSIVE roots AS (
  SELECT category_id, category_id AS root_id FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.category_id, r.root_id FROM categories c JOIN roots r ON c.parent_id = r.category_id
), yearly AS (
  SELECT r.root_id,
         sum(oi.quantity * oi.unit_price) FILTER (WHERE o.order_date >= '2024-01-01' AND o.order_date < '2025-01-01') AS rev_2024,
         sum(oi.quantity * oi.unit_price) FILTER (WHERE o.order_date >= '2025-01-01' AND o.order_date < '2026-01-01') AS rev_2025
  FROM order_items oi
  JOIN orders o   ON o.order_id = oi.order_id
  JOIN products p ON p.product_id = oi.product_id
  JOIN roots r    ON r.category_id = p.category_id
  WHERE o.status <> 'cancelled'
  GROUP BY r.root_id
)
SELECT c.name, y.rev_2024, y.rev_2025,
       round(100 * (y.rev_2025 - y.rev_2024) / y.rev_2024, 1) AS growth_pct,
       rank() OVER (ORDER BY (y.rev_2025 - y.rev_2024) / y.rev_2024 DESC) AS rank
FROM yearly y JOIN categories c ON c.category_id = y.root_id
ORDER BY rank, c.name;
```

```sql wrong
WITH yearly AS (
  SELECT p.category_id AS root_id,
         sum(oi.quantity * oi.unit_price) FILTER (WHERE o.order_date >= '2024-01-01' AND o.order_date < '2025-01-01') AS rev_2024,
         sum(oi.quantity * oi.unit_price) FILTER (WHERE o.order_date >= '2025-01-01' AND o.order_date < '2026-01-01') AS rev_2025
  FROM order_items oi
  JOIN orders o   ON o.order_id = oi.order_id
  JOIN products p ON p.product_id = oi.product_id
  WHERE o.status <> 'cancelled'
  GROUP BY p.category_id
)
SELECT c.name, y.rev_2024, y.rev_2025,
       round(100 * (y.rev_2025 - y.rev_2024) / y.rev_2024, 1) AS growth_pct,
       rank() OVER (ORDER BY (y.rev_2025 - y.rev_2024) / y.rev_2024 DESC) AS rank
FROM yearly y JOIN categories c ON c.category_id = y.root_id
WHERE c.parent_id IS NULL
ORDER BY rank, c.name;
```
