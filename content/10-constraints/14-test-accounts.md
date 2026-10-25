---
title: Bank accounts
kind: test
dataset: empty
---
Create `accounts` with:

- `account_id`: always-generated identity primary key
- `iban`: required `text`, unique
- `owner`: required `text`
- `currency`: required, exactly one of `EUR`, `GBP` or `USD`
- `balance`: required `numeric(14,2)`, default 0, **never negative**

```sql solution
CREATE TABLE accounts (
  account_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  iban       text NOT NULL UNIQUE,
  owner      text NOT NULL,
  currency   text NOT NULL CHECK (currency IN ('EUR', 'GBP', 'USD')),
  balance    numeric(14,2) NOT NULL DEFAULT 0 CHECK (balance >= 0)
);
```

```sql check Valid accounts open with a zero balance
INSERT INTO accounts (iban, owner, currency) VALUES ('GB01', 'Ada', 'GBP'), ('DE02', 'Alan', 'EUR') RETURNING account_id, balance;
```

```sql check Unknown currencies are rejected
INSERT INTO accounts (iban, owner, currency) VALUES ('JP03', 'Kenji', 'JPY');
```

```sql check Overdrafts are rejected
INSERT INTO accounts (iban, owner, currency) VALUES ('US04', 'Grace', 'USD');
UPDATE accounts SET balance = balance - 10 WHERE iban = 'US04';
```

```sql check Duplicate IBANs are rejected
INSERT INTO accounts (iban, owner, currency) VALUES ('FR05', 'A', 'EUR'), ('FR05', 'B', 'EUR');
```

```sql check Currency is required
INSERT INTO accounts (iban, owner) VALUES ('NL06', 'C');
```

```sql wrong
CREATE TABLE accounts (
  account_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  iban       text NOT NULL UNIQUE,
  owner      text NOT NULL,
  currency   text CHECK (currency IN ('EUR', 'GBP', 'USD')),
  balance    numeric(14,2) NOT NULL DEFAULT 0 CHECK (balance >= 0)
);
```
