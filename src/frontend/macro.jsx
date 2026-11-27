import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text, Section, useProductContext } from "@forge/react";
import { invoke } from "@forge/bridge";

// Confluence macro: shows the decision recorded on this page,
// or says plainly that no decision has been recorded yet.
const App = () => {
  const context = useProductContext();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    invoke("getDecision", { context }).then(setRecord).catch((e) => setError(String(e)));
  }, [context]);

  if (error) return <Text>Could not load the decision: {error}</Text>;
  if (!record) return <Text>Loading the decision…</Text>;
  if (!record.decision) {
    return (
      <Section>
        <Text>📋 Decision Log — no decision recorded on this page yet.</Text>
        <Text>Record one with a title, the decision, at least one decider, and a date.</Text>
      </Section>
    );
  }
  const d = record.decision;
  return (
    <Section>
      <Text>📋 Decision Log — {d.title}</Text>
      <Text>Decided: {d.decision}</Text>
      <Text>Deciders: {(d.deciders || []).join(", ")} · {d.date} · Status: {d.status || "current"}</Text>
      {(d.linkedIssues || []).length > 0 ? <Text>Linked issues: {d.linkedIssues.join(", ")}</Text> : null}
      {d.status === "superseded" ? <Text>This decision has been superseded — see the newer record before acting on it.</Text> : null}
      {d.status === "expired" ? <Text>This decision has expired — treat it as history, not a rule.</Text> : null}
    </Section>
  );
};

ForgeReconciler.render(<React.StrictMode><App /></React.StrictMode>);
