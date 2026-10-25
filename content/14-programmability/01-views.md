---
title: Views and materialized views
kind: lesson
cumulative: true
---
A **view** is a saved query you can select from like a table:

```sql
CREATE VIEW customer_stats AS
SELECT c.customer_id, c.country, count(o.order_id) AS orders, max(o.order_date) AS last_order
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.country;

SELECT * FROM customer_stats WHERE country = 'Kenya' ORDER BY orders DESC LIMIT 5;
```

A view stores **no data**. Every query against it runs the underlying query, and the planner merges your `WHERE` into it, so filters can still use indexes. Views give a complicated query a name, give every team the same definition of "active customer", and let you grant access to a view instead of the raw tables (Module 16).

`CREATE OR REPLACE VIEW` changes a view's query (you can add columns at the end, but not remove or retype them). `DROP VIEW` removes it. You can't drop a table a view depends on unless you `CASCADE`.

## Updatable views

A simple view, one table with no aggregates, `DISTINCT` or joins, is **automatically updatable**: `INSERT`, `UPDATE` and `DELETE` on it change the underlying table. `WITH CHECK OPTION` refuses changes that would make the row disappear from the view:

```sql
CREATE VIEW active_products AS
SELECT product_id, name, category_id, price, stock, discontinued, added_on
FROM products WHERE NOT discontinued
WITH CHECK OPTION;

UPDATE active_products SET price = price + 1 WHERE product_id = 1 RETURNING name, price;
```

```sql error
UPDATE active_products SET discontinued = true WHERE product_id = 1;
```

## Materialized views

A **materialized view** stores its result like a table. It's fast to read but **stale** until you refresh it:

```sql
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT date_trunc('month', o.order_date)::date AS month, sum(oi.quantity * oi.unit_price) AS revenue
FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY 1;

SELECT * FROM monthly_revenue ORDER BY month DESC LIMIT 3;
```

```sql
REFRESH MATERIALIZED VIEW monthly_revenue;
SELECT count(*) AS months FROM monthly_revenue;
```

`REFRESH` recomputes everything and blocks reads while it runs. With a unique index on the materialized view, `REFRESH MATERIALIZED VIEW CONCURRENTLY` lets readers continue. Materialized views suit dashboards and reports that can be a few minutes (or hours) behind and are expensive to compute.

> **Dialect note.** Views are universal. SQL Server's *indexed views* are materialized and kept up to date automatically (with many restrictions). Oracle has materialized views with incremental *fast refresh*. MySQL has no materialized views. PostgreSQL's are always refreshed in full.
