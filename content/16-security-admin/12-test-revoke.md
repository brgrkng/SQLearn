---
title: Tighten an intern's access
kind: test
---
The setup gave the role `intern` far too much: every privilege on `orders` and `customers`. Change it so `intern` can only **read** those two tables.

```sql setup
CREATE ROLE intern NOLOGIN;
GRANT ALL ON orders, customers TO intern;
```

```sql solution
REVOKE ALL ON orders, customers FROM intern;
GRANT SELECT ON orders, customers TO intern;
```

```sql check The intern can still read
SET ROLE intern;
SELECT (SELECT count(*) FROM orders) > 0, (SELECT count(*) FROM customers) > 0;
```

```sql check The intern can't update customers
SET ROLE intern;
UPDATE customers SET city = 'Nowhere' WHERE customer_id = 1;
```

```sql check The intern can't delete orders
SET ROLE intern;
DELETE FROM orders WHERE order_id = 1;
```

```sql wrong
REVOKE DELETE ON orders, customers FROM intern;
```
