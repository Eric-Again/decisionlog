import { getDecision, saveDecision, getRelated } from "./resolvers/index.js";

// Thin entry point required by the Forge function module.
// The real logic lives in src/resolvers/index.js and
// src/decisions.js so it can be unit-tested without Forge.
export const handler = async (req) => {
  const payload = typeof req?.payload === "string" ? JSON.parse(req.payload) : (req?.payload || {});
  if (payload.method === "saveDecision") return await saveDecision(payload);
  if (payload.method === "getRelated") return await getRelated(payload);
  return await getDecision(payload);
};
