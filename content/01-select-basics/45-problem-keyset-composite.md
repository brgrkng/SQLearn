---
title: Next page, sorted by price
kind: problem
difficulty: hard
ordered: true
hints:
  - Several products cost exactly $49.99. Which of them come *after* product 83?
  - "A row is after (49.99, 83) if its price is higher, **or** its price is equal and its id is higher."
  - "PostgreSQL can compare rows directly: `(a, b) > (x, y)`."
---
The catalogue is sorted by `price`, then `product_id`, 10 products per page. The last product the shopper saw was **product 83**, priced **$49.99**. Return the `product_id`, `name` and `price` of the **next 10 products**. Don't use `OFFSET`.

```sql solution
SELECT product_id, name, price
FROM products
WHERE (price, product_id) > (49.99, 83)
ORDER BY price, product_id
LIMIT 10;
```

```sql wrong
SELECT product_id, name, price
FROM products
WHERE price > 49.99 AND product_id > 83
ORDER BY price, product_id
LIMIT 10;
```

```sql wrong
SELECT product_id, name, price
FROM products
WHERE price >= 49.99 AND product_id > 83
ORDER BY price, product_id
LIMIT 10;
```

```sql wrong
SELECT product_id, name, price
FROM products
WHERE price > 49.99
ORDER BY price, product_id
LIMIT 10;
```

## Explanation
Keyset pagination over a **composite** sort key needs the condition "after (49.99, 83) in sort order":

```sql norun
WHERE price > 49.99 OR (price = 49.99 AND product_id > 83)
```

The tempting `price >= 49.99 AND product_id > 83` is wrong because it drops every pricier product whose id happens to be lower, such as product 47 at $50.99. PostgreSQL's **row comparison** `(price, product_id) > (49.99, 83)` means exactly the correct version, and an index on `(price, product_id)` can use it directly.
