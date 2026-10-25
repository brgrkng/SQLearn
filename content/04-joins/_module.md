---
title: Joins
summary: Combining tables. Inner and outer joins, self-joins, anti-joins, the fan-out trap, and how PostgreSQL executes a join.
---
Well-designed databases split information across tables: a customer's details live in `customers`, their orders in `orders`, and the products on each order in `order_items`. That keeps each fact in one place (Module 11 explains why), but almost every useful question needs several tables at once. **Joins** put them back together.
