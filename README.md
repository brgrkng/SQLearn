# SQLearn

A course that takes you from your first `SELECT` to query tuning and database design, in PostgreSQL. Each module has lessons with runnable examples, drills, a test and interview-style problems. Every exercise is graded automatically on **correctness** (result set, or schema behaviour) and **efficiency** (`EXPLAIN` cost against a reference solution).

The full syllabus is in [docs/CURRICULUM.md](docs/CURRICULUM.md).

## Stack

| Piece | Choice | Why |
|---|---|---|
| UI | React + Vite + TypeScript | Static site, no server to run |
| SQL engine | [PGlite](https://pglite.dev) (PostgreSQL 18 compiled to WASM) in a Web Worker | Real Postgres in the browser. Every run gets a fresh copy of the dataset, and a runaway query is stopped by killing the worker |
| Editor | CodeMirror 6 | PostgreSQL highlighting, plus autocomplete from the dataset schema |
| Accounts and progress | Supabase (free tier) | Email magic-link login, with a `progress` table protected by row-level security |
| Hosting | GitHub Pages | Free, deployed on every push to `main` |

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # grades every exercise's reference solution, starter and known-wrong answers
```

Without Supabase settings the app still runs, but progress isn't saved.

## Supabase setup (one time)

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor**: paste and run [supabase/schema.sql](supabase/schema.sql).
3. **Authentication → Users → Add user**: create your own account (email, with auto-confirm on).
4. **Authentication → Sign In / Providers**: turn off *Allow new users to sign up*, so nobody else can create an account.
5. **Authentication → URL Configuration**: set *Site URL* to `https://brgrkng.github.io/SQLearn/` and add `http://localhost:5173` to *Redirect URLs*.
6. **Project Settings → API**: copy the project URL and the publishable (anon) key into `.env.local` (see [.env.example](.env.example)). For the deployed site, add them as repository **variables** `SUPABASE_URL` and `SUPABASE_KEY` (Settings → Secrets and variables → Actions → Variables).

## Deploy

Settings → Pages → Source: **GitHub Actions**. After that, every push to `main` runs the content tests and then deploys to `https://brgrkng.github.io/SQLearn/`.

## Writing content

```
content/<NN-module>/_module.md     title + summary (frontmatter), intro (body)
content/<NN-module>/<NN-item>.md   one lesson or exercise
datasets/<name>.sql                seed script for a dataset: shop (default), hr, analytics, bikeshare; `empty` = blank database
```

Numeric prefixes set the order and are dropped from IDs: `01-select-basics/09-where-equals.md` becomes `select-basics/where-equals`. Progress is keyed by ID, so **don't rename a file once it's live**. Renumbering is fine.

**Lessons** (`kind: lesson`) are Markdown. Every ` ```sql ` block becomes a runnable, editable example. Use ` ```sql norun ` for static code, such as other dialects, and ` ```sql error ` for an example that is meant to fail. Put dialect notes in blockquotes starting `**Dialect note.**`. Each example runs on a fresh database. With `cumulative: true` in the frontmatter, every earlier example (except `error` ones) runs first, so DDL lessons can build up step by step.

**Exercises** (`kind: drill | test | problem`). The body is the prompt. Code blocks with a role are pulled out of the prompt:

| Block | Meaning |
|---|---|
| ` ```sql solution ` | Reference solution (required) |
| ` ```sql starter ` | Initial editor contents. Must fail grading |
| ` ```sql wrong ` | A known-wrong answer, such as a classic mistake. Tests assert it fails. Add one for every trap |
| ` ```sql setup ` | Hidden SQL run before both the learner's and the reference SQL |
| ` ```sql check <label> ` | Turns on behaviour grading (below) |
| ` ```sql explain ` | The query whose cost is compared, when it differs from the submitted SQL (e.g. "add an index so this query is fast") |

Everything after a `## Explanation` heading is shown once the exercise is passed.

Frontmatter: `title`, `kind`, `dataset`, `difficulty` (easy/medium/hard, for problems), `ordered: true` (row order matters), `columnNames: true` (column names must match), `maxCostRatio` (default `2`; `false` turns off the efficiency check), `costSlack` (default `50`; lower it for index exercises on small tables), `hints` (a list, revealed one at a time).

**Grading.** With no `check` blocks, the last result set of the learner's SQL is compared with the reference's: same number of columns, the same multiset of rows (in order if `ordered`), with numbers compared by value. With `check` blocks, the learner's SQL and the reference each run on their own fresh database, then each check runs on both. Every check must produce the same rows, or fail with the same SQLSTATE (e.g. `23505` unique violation). This is how schema and design tasks are graded by behaviour. Efficiency passes when the learner's `EXPLAIN` total cost is at most `maxCostRatio × reference + costSlack`. The cost measured is the `explain` block's query if there is one, otherwise the **last statement** of the learner's SQL. An exercise whose reference returns no rows and has no checks (typically `CREATE INDEX ...` plus an `explain` block) is graded on cost alone. Every check starts as the superuser outside any transaction, so `SET ROLE` or a failed `BEGIN` in one check can't affect the next. Item IDs must be unique within a module, and the loader refuses duplicates.

**Datasets are frozen.** Content refers to real values (emails, dates, IDs) in the generated data. Changing a seed script changes that data, so run `npm test` afterwards. A reference that returns no rows fails the tests, which catches most stale references.
