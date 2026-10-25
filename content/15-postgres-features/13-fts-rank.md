---
title: Rank the results
kind: drill
dataset: empty
ordered: true
hints:
  - "`ts_rank(to_tsvector('english', title || ' ' || body), q)` with `q` from `websearch_to_tsquery`."
  - Keep only matches (`@@`), then order by rank.
---
Search the help articles for **`reset password`** (use `websearch_to_tsquery('english', ...)`) over the title and body combined. Return matching `article_id`s ordered by `ts_rank` descending, ties broken by `article_id`.

```sql setup
CREATE TABLE help (article_id int PRIMARY KEY, title text NOT NULL, body text NOT NULL);
INSERT INTO help VALUES
  (1, 'Account access', 'Use the reset link to choose a new password.'),
  (2, 'Two-factor login', 'Add an authenticator app. You can reset two-factor from settings.'),
  (3, 'Billing questions', 'Invoices are emailed monthly.'),
  (4, 'Reset a forgotten password', 'Forgot your password? Request a password reset email. The reset link expires after one hour.'),
  (5, 'Change your email', 'Update your email address in settings.');
```

```sql solution
SELECT article_id
FROM help, websearch_to_tsquery('english', 'reset password') AS q
WHERE to_tsvector('english', title || ' ' || body) @@ q
ORDER BY ts_rank(to_tsvector('english', title || ' ' || body), q) DESC, article_id;
```

```sql wrong
SELECT article_id
FROM help, websearch_to_tsquery('english', 'reset password') AS q
WHERE to_tsvector('english', title || ' ' || body) @@ q
ORDER BY article_id;
```

```sql wrong
SELECT article_id FROM help
WHERE title || ' ' || body ILIKE '%reset%password%'
ORDER BY article_id;
```
