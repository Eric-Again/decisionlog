# Decision Log — Codegeist 2026 (Apps for Business Teams)

Teams re-decide the same thing because decisions die in meeting
notes nobody re-reads. Decision Log is a Forge app that records a
decision where it was made and surfaces it where it matters:

- **Confluence macro** — insert "Decision Log" on a page to record
  a decision: title, the decision itself, at least one decider, a
  date, a status (current / superseded / expired), topics, and
  linked Jira issues. A record missing a decider or a date is a
  draft, and the macro says what is missing instead of pretending
  it is recorded.
- **Jira issue panel** — "Past decisions" on any issue shows up to
  3 earlier decisions touching that issue's topic, ranked by
  relevance, with superseded and expired ones still visible but
  flagged and ranked below current ones — so the team reads what
  was decided before re-deciding it.

## How it works
- Decisions persist in Forge Storage (`storage:app`), keyed per
  Confluence page, with an index of all recorded pages. No
  external calls, no data leaves Atlassian.
- Pure logic in `src/decisions.js` (validation, relevance scoring,
  related-decision ranking, status summary) — no Forge imports,
  unit-tested with plain node.
- Resolver in `src/resolvers/index.js` (get / save / related).
- Frontends in `src/frontend/macro.jsx` and `panel.jsx` (UI Kit,
  native render).

## Files
- `manifest.yml` — `confluence:macro` + `jira:issuePanel` +
  function resolver; scopes `read:confluence-content.all`,
  `read:jira-work`, `storage:app`; runtime `nodejs24.x`. The app
  id is a placeholder: `forge create` assigns the real one.
- `src/decisions.js`, `src/resolvers/index.js`, `src/index.js`
- `src/frontend/macro.jsx`, `src/frontend/panel.jsx`
- `test/decisions.test.mjs` — 7 unit tests, all passing.
- `preview.html` — phone preview of the matching logic only
  (not the Forge app). Open it in a browser, record a decision,
  then check a Jira issue against it.
- `SUBMISSION.md` — Devpost checklist, demo script, laptop
  deploy steps.

## Tests (verified 2026-11-27)
```
npm test   # node --test test/decisions.test.mjs
# 7 pass, 0 fail:
# complete decision validates; missing decider/date is a draft
# bad status rejected; topic match outranks no match
# superseded still surfaces, ranked below current
# at most 3 related, best first; status summary counts
```

## Run it (needs a laptop / terminal)
Forge CLI 16.0.0 was checked here earlier (Node 24.22.1 meets
the CLI's Node 22/24 requirement), but `forge lint` / `forge
deploy` need `forge login` with your Atlassian account — that
step is yours, on a laptop.
1. Install Node 22.x or 24.x, then `npm install -g @forge/cli`
2. `forge login` (Atlassian account + API token)
3. `forge create` — pick a template, or copy these files into
   the created app, keeping the app id it assigns.
4. `npm install`, then `forge deploy`
5. `forge install --site <your-site>.atlassian.net --product confluence`
   and again with `--product jira` (the app has modules for both)
   (or `forge site provision` for a demo site with seeded data)
6. In Confluence, insert the Decision Log macro on a page and
   record a decision. In Jira, open an issue on the same topic
   and read the Past decisions panel.
7. For judges: `forge deploy -e production`, then developer
   console → Distribution → Sharing → copy the installation
   link. Do NOT pick "Sharing within organization".

## Submission
See SUBMISSION.md. Deadline: Tue 22 Dec 2026, 12:00 PM PT
(8:00 PM UTC, 9:00 PM WAT).
