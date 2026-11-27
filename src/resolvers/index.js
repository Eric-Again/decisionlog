import api, { storage } from "@forge/api";
import { validateDecision, relatedDecisions, stillTrueSummary } from "../decisions.js";

// Decision Log resolver. Decisions persist in Forge Storage
// (storage:app), keyed per Confluence page and listed for
// related Jira issues. No external calls, no data leaves Atlassian.
const keyForPage = (pageId) => `decision-log:page:${pageId}`;
const INDEX_KEY = "decision-log:index";

async function readIndex() {
  const index = await storage.get(INDEX_KEY);
  return Array.isArray(index) ? index : [];
}

async function writeIndex(index) {
  await storage.set(INDEX_KEY, index);
}

export async function getDecision(payload) {
  const pageId = payload?.context?.extension?.content?.id || payload?.pageId || "demo";
  const record = await storage.get(keyForPage(pageId));
  return { pageId, decision: record || null };
}

export async function saveDecision(payload) {
  const decision = payload?.decision || {};
  const check = validateDecision(decision);
  if (!check.valid) return { saved: false, missing: check.missing };
  const pageId = payload?.pageId || decision.pageId || "demo";
  const record = { ...decision, id: `dec-${pageId}`, pageId, updatedAt: new Date().toISOString().slice(0, 10) };
  await storage.set(keyForPage(pageId), record);
  const index = await readIndex();
  if (!index.includes(pageId)) {
    index.push(pageId);
    await writeIndex(index);
  }
  return { saved: true, decision: record };
}

export async function getRelated(payload) {
  const context = {
    title: payload?.summary || payload?.title || "",
    description: payload?.description || "",
    labels: payload?.labels || [],
  };
  const index = await readIndex();
  const all = [];
  for (const pageId of index) {
    const record = await storage.get(keyForPage(pageId));
    if (record) all.push(record);
  }
  return { related: relatedDecisions(all, context, 3), summary: stillTrueSummary(all) };
}

export const handler = async (req) => {
  const payload = typeof req?.payload === "string" ? JSON.parse(req.payload) : (req?.payload || {});
  if (req?.payload?.method === "saveDecision" || payload.method === "saveDecision") return await saveDecision(payload);
  if (req?.payload?.method === "getRelated" || payload.method === "getRelated") return await getRelated(payload);
  return await getDecision(payload);
};
