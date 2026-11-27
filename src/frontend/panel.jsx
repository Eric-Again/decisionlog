import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text, Section, useProductContext } from "@forge/react";
import { invoke } from "@forge/bridge";

// Jira issue panel: past decisions that touch this issue's topic,
// so the team sees what was already decided before re-deciding it.
const App = () => {
  const context = useProductContext();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    invoke("getRelated", { context }).then(setData).catch((e) => setError(String(e)));
  }, [context]);

  if (error) return <Text>Could not load past decisions: {error}</Text>;
  if (!data) return <Text>Checking past decisions…</Text>;
  if (data.related.length === 0) {
    return (
      <Section>
        <Text>📋 Past decisions — none found for this issue.</Text>
        <Text>No earlier decision touches this topic. If this issue decides something, record it in Confluence with the Decision Log macro.</Text>
      </Section>
    );
  }
  return (
    <>
      <Section>
        <Text>📋 Past decisions — {data.related.length} found ({data.summary.current} current, {data.summary.superseded} superseded, {data.summary.expired} expired)</Text>
      </Section>
      <Section>
        {data.related.map((d) => (
          <Text key={d.id}>
            {d.title} — {d.decision} ({d.status}, {d.date}, {d.deciders.join(", ")})
          </Text>
        ))}
      </Section>
      <Section>
        <Text>Read the full record in Confluence before re-deciding this.</Text>
      </Section>
    </>
  );
};

ForgeReconciler.render(<React.StrictMode><App /></React.StrictMode>);
