---
title: A read-only reporting role
kind: drill
hints:
  - "`CREATE ROLE reporting NOLOGIN;` then `GRANT SELECT ON orders, customers TO reporting;`"
---
Create a role `reporting` (it can't log in) that can **read** `orders` and `customers`, and nothing else: no changes to them, and no access to other tables.

```sql solution
CREATE ROLE reporting NOLOGIN;
GRANT SELECT ON orders, customers TO reporting;
```

```sql check It can read orders and customers
SET ROLE reporting;
SELECT (SELECT count(*) FROM orders), (SELECT count(*) FROM customers);
```

```sql check It can't change orders
SET ROLE reporting;
DELETE FROM orders WHERE order_id = 1;
```

```sql check It can't read products
SET ROLE reporting;
SELECT count(*) FROM products;
```

```sql check It can't log in
SELECT rolcanlogin FROM pg_roles WHERE rolname = 'reporting';
```

```sql wrong
CREATE ROLE reporting NOLOGIN;
GRANT SELECT, DELETE ON orders, customers TO reporting;
```

```sql wrong
CREATE ROLE reporting LOGIN;
GRANT SELECT ON orders, customers TO reporting;
```
