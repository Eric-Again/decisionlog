# SUBMISSION.md — Codegeist 2026, Decision Log

Category: **Apps for Business Teams**
("Give business teams the context to act decisively. Help
colleagues in marketing, sales, HR, finance, support, or legal
move faster with the right information in front of them.")

## Why this category
Decision Log is not a developer tool and not a bounty tool. It
serves any business team that makes decisions in Confluence and
tracks work in Jira — which is every team in the category's list.
It answers the challenge directly: "turning organizational data
into a decision that actually moves work forward" — by keeping
decisions findable at the moment a new issue would re-decide them.

## Devpost checklist
- [ ] Join Codegeist on Devpost (free Devpost account)
- [ ] Free Atlassian Cloud Developer site — get one at
      go.atlassian.com/cloud-dev, or `forge site provision`
      for a demo site with seeded Jira / Confluence data
- [ ] Forge app built, deployed, installed on your dev site
      (install to BOTH Confluence and Jira — the app has a
      module for each)
- [ ] Installation link for judges (production deploy +
      developer console → Distribution → Sharing, NOT
      "Sharing within organization")
- [ ] Text description: features + how it meets the Forge /
      Confluence + Jira requirement
- [ ] Demo video: under 5 minutes, public YouTube, shows
      the macro and the panel working end-to-end
- [ ] Submit by Tue 22 Dec 2026, 12:00 PM PT (8:00 PM UTC,
      9:00 PM WAT). Judging 5 Jan–3 Feb 2027, winners ~15 Feb 2027.

## Bonus prizes — optional stretches, in order
1. Best app with Teamwork Graph integration ($1,500 x6) —
   needs graph scopes + org admin approval. Only attempt
   after the core macro + panel work. A natural fit: decisions
   as graph nodes, linked to goals, people and outcomes.
2. Best Agents / Rovo ($1,500 x6) — needs a rovo:agent
   module. Same rule: core first.
3. Best Marketplace published app ($1,500 x6) — needs a
   Marketplace listing / review ticket. Do not start this
   until the core is submitted as a draft.

## Demo script (under 5 minutes)
0:00 — "Teams re-decide the same thing because decisions die
      in meeting notes. Decision Log records a decision where
      it was made and surfaces it where it matters."
0:30 — Confluence: insert the Decision Log macro, record a
      decision (title, decision, deciders, date, topics).
      Show a draft first: leave the deciders out and the macro
      says what is missing.
1:45 — Jira: open an issue on the same topic. The Past
      decisions panel shows the record just made.
3:00 — Record a second, superseded decision on the same topic.
      Re-open the issue: both surface, the current one first,
      the superseded one flagged.
4:00 — Show the install link and that no data leaves Atlassian.

## The laptop gate — say it plainly
Forge needs the CLI: Node 22/24, `npm install -g @forge/cli`,
`forge login`, `forge deploy`, `forge install`. Eric is
phone-only, so this step needs a laptop — his own when it
returns, or the same friend who took Kiroween. The code in
this repo is complete and tested (7 unit tests passing);
do not present it as deployed until that session has run.

## Relation to TriageGhost
TriageGhost (Apps for Software Teams, Jira issue triage) is a
separate, already-built entry in Eric-Again/triageghost. It is
NOT replaced by this app: Codegeist allows more than one
submission as long as each is unique and substantially
different. Decision Log is the non-bounty entry; TriageGhost
remains the software-teams entry unless Eric chooses otherwise.
