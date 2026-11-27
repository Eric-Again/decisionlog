// Pure decision logic for Decision Log — no Forge imports,
// so it can be unit-tested with plain node.
//
// A decision record:
//   { id, title, decision, deciders: [names], date: "YYYY-MM-DD",
//     status: "current" | "superseded" | "expired",
//     topics: [keywords], linkedIssues: ["PROJ-123"], pageId }
// Validation: a decision is only "recorded" when it names the
// decision, at least one decider, and a date. Everything else
// is a draft, and the panel says so instead of pretending.
const STATUSES = ["current", "superseded", "expired"];

export function validateDecision(d = {}) {
  const missing = [];
  if (!d.title || !String(d.title).trim()) missing.push("title");
  if (!d.decision || !String(d.decision).trim()) missing.push("decision");
  if (!Array.isArray(d.deciders) || d.deciders.filter(Boolean).length === 0) missing.push("deciders");
  if (!d.date || !/^\d{4}-\d{2}-\d{2}$/.test(String(d.date))) missing.push("date (YYYY-MM-DD)");
  if (d.status && !STATUSES.includes(d.status)) missing.push("status must be current, superseded or expired");
  return { valid: missing.length === 0, missing };
}

function words(text) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2);
}

// Relevance of a stored decision to a Jira issue / page:
// shared topic words count double, shared title words count once.
// Superseded and expired decisions still surface, but ranked
// below current ones and flagged — a team should see what was
// decided before, even if it no longer stands.
export function relevanceScore(decision, { title = "", description = "", labels = [] } = {}) {
  const hay = new Set([...words(title), ...words(description), ...labels.map((l) => String(l).toLowerCase())]);
  const topicHits = (decision.topics || []).filter((t) => hay.has(String(t).toLowerCase())).length;
  const titleHits = words(decision.title).filter((w) => hay.has(w)).length;
  let score = topicHits * 2 + titleHits;
  if (decision.status === "superseded" || decision.status === "expired") score -= 1;
  return Math.max(0, score);
}

export function relatedDecisions(decisions, context, limit = 3) {
  return decisions
    .map((d) => ({ ...d, relevance: relevanceScore(d, context) }))
    .filter((d) => d.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance || (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

export function stillTrueSummary(decisions) {
  const current = decisions.filter((d) => d.status === "current").length;
  const superseded = decisions.filter((d) => d.status === "superseded").length;
  const expired = decisions.filter((d) => d.status === "expired").length;
  return { total: decisions.length, current, superseded, expired };
}
