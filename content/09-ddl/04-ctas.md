---
title: A snapshot table
kind: drill
hints:
  - "`CREATE TABLE ... AS SELECT ...`"
---
Create a table `vip_customers` holding the `customer_id`, `first_name`, `last_name` and `country` of every **platinum**-tier customer, built from a query.

```sql solution
CREATE TABLE vip_customers AS
SELECT customer_id, first_name, last_name, country FROM customers WHERE loyalty_tier = 'platinum';
```

```sql check Contents
SELECT customer_id, first_name, last_name, country FROM vip_customers;
```

```sql wrong
CREATE TABLE vip_customers AS
SELECT customer_id, first_name, last_name, country FROM customers WHERE loyalty_tier IN ('gold', 'platinum');
```
