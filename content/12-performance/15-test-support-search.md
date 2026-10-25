---
title: Support lookup
kind: test
costSlack: 10
---
Support agents look up a customer's returned orders constantly. Make this query cheap with **one** index:

```sql norun
SELECT order_id, order_date FROM orders WHERE customer_id = 1234 AND status = 'returned';
```

```sql solution
CREATE INDEX orders_customer_status_idx ON orders (customer_id, status);
```

```sql explain
SELECT order_id, order_date FROM orders WHERE customer_id = 1234 AND status = 'returned';
```

```sql wrong
CREATE INDEX orders_status_idx ON orders (status);
```

```sql wrong
CREATE INDEX orders_status_customer_date_idx ON orders (order_date, status, customer_id);
```
