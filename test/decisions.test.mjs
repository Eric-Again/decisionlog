// Unit tests for the pure decision logic.
// Run with: node --test test/decisions.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { validateDecision, relevanceScore, relatedDecisions, stillTrueSummary } from "../src/decisions.js";

const full = {
  title: "Use Forge Storage for decisions",
  decision: "Store decision records in Forge Storage, not in page text.",
  deciders: ["Ada", "Ben"],
  date: "2026-11-27",
  status: "current",
  topics: ["storage", "forge"],
  linkedIssues: ["TEAM-1"],
};

test("a complete decision validates", () => {
  const r = validateDecision(full);
  assert.equal(r.valid, true);
  assert.deepEqual(r.missing, []);
});

test("a decision without deciders or a date is a draft, and the panel says what is missing", () => {
  const r = validateDecision({ title: "Pick a database", decision: "Use Postgres." });
  assert.equal(r.valid, false);
  assert.ok(r.missing.includes("deciders"));
  assert.ok(r.missing.some((m) => m.startsWith("date")));
});

test("a bad status is rejected", () => {
  const r = validateDecision({ ...full, status: "maybe" });
  assert.equal(r.valid, false);
});

test("a decision sharing topics with an issue scores higher than one sharing nothing", () => {
  const other = { ...full, title: "Office snacks", topics: ["snacks"] };
  const ctx = { title: "Forge Storage design", description: "Where do we store decisions?", labels: [] };
  assert.ok(relevanceScore(full, ctx) > relevanceScore(other, ctx));
  assert.equal(relevanceScore(other, ctx), 0);
});

test("superseded decisions still surface, ranked below current ones", () => {
  const old = { ...full, status: "superseded", date: "2026-01-05" };
  const list = relatedDecisions([old, full], { title: "Forge Storage", description: "", labels: [] });
  assert.equal(list.length, 2);
  assert.equal(list[0].status, "current");
  assert.equal(list[1].status, "superseded");
});

test("relatedDecisions returns at most 3, best first", () => {
  const mk = (i) => ({ ...full, id: `d${i}`, title: `Forge Storage choice ${i}`, topics: ["forge", "storage"] });
  const list = relatedDecisions([mk(1), mk(2), mk(3), mk(4), mk(5)], { title: "Forge Storage", description: "", labels: [] });
  assert.equal(list.length, 3);
});

test("stillTrueSummary counts by status", () => {
  const s = stillTrueSummary([
    { ...full, status: "current" },
    { ...full, status: "superseded" },
    { ...full, status: "expired" },
    { ...full, status: "current" },
  ]);
  assert.deepEqual(s, { total: 4, current: 2, superseded: 1, expired: 1 });
});
