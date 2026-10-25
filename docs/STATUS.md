# Project status

*Last updated: 25 October 2026*

## What exists

All 18 modules in [CURRICULUM.md](CURRICULUM.md) are written and tested:

| | Count |
|---|---|
| Lessons | 63 |
| Drills | 199 |
| Test questions | 80 |
| Problems (including 43 interview problems) | 89 |
| Datasets | 4 (`shop`, `hr`, `analytics`, `bikeshare`) plus `empty` |

Deployed at https://brgrkng.github.io/SQLearn/. Every push to `main` runs the content tests, then deploys.

## How it's verified

- **Content tests** (`npm test`, about 4–5 minutes): every exercise's reference solution must pass its own grader, and its starter and every known-wrong answer must fail. Every lesson example must run (or fail, when marked `error`). Duplicate IDs, an empty reference result and YAML errors all fail the build.
- **Unit tests**: result comparison, and the statement splitter used for cost measurement.
- **Browser checks**: an automated crawl rendered all 431 pages without errors. Spot checks covered running examples, result grading, state-check grading, cost-only (index) grading, the setup panel, extension loading (`btree_gist`), walkthrough tables, and the production build under `/SQLearn/`.
- **Supabase**: the `progress` table exists, anonymous inserts are rejected by RLS, anonymous reads return nothing, and sign-ups are disabled.

## Not yet tested

- **Login and progress saving end to end.** Magic-link sign-in needs access to the email inbox.
- **Prose accuracy and tone.** Tests check the SQL's behaviour, not the explanations. Dialect notes were written from knowledge and haven't been checked against each vendor's documentation.
- **A visual pass of every page.** The crawl checks that pages render. Looking at them was a spot check.
- **Other browsers** (Firefox, Safari) and low-end hardware. Testing used Chromium only.

## Known issues and limits

- **Loading:** the first visit in a session spends 2–6 seconds building each dataset, and each dataset snapshot uses about 90 MB of browser memory. Each Run or Submit takes about 0.6 seconds, because it restores a fresh database.
- **Time limit:** queries running longer than 20 seconds are stopped, and the next run rebuilds the dataset.
- **Efficiency grading** compares planner cost *estimates* (deterministic) with a 2× + slack rule. An unusual but valid plan could occasionally be marked slow.
- **Single connection:** the in-browser database has one connection. Concurrency is taught with step-by-step T1/T2 walkthroughs, and the lock-ordering drill can only grade the outcome, not the order the locks were taken.
- **Confusing label:** on cost-only exercises, "Estimated plan cost" under the output is the measured query's cost, not the cost of the learner's own SQL.
- **Frozen datasets:** content cites real values in the generated data. Changing a seed script requires rerunning the tests and fixing any references that broke.
- **Desktop only:** mobile layout is out of scope, and the sidebar is hidden below 760px.
- **Bundle size:** about 860 KB of JavaScript, plus 3.7 MB (gzipped) of PGlite WASM.

## Setup changes made on the owner's behalf

- GitHub Pages source switched to **GitHub Actions**.
- Repository variables `SUPABASE_URL` and `SUPABASE_KEY` created from `.env.local`.
- `.env.example` reverted to placeholders (real keys had been pasted into it; they were never committed).

## Ideas for later

- Split the content tests across CI jobs as the course grows.
- Prebuild dataset snapshots at build time, so the first load in a session is faster.
- Public launch: open sign-ups (flip `shouldCreateUser` and the Supabase setting), add a landing page, and add analytics on where learners get stuck.
