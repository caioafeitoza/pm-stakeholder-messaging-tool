function generateUpdates(input) {
  const { shipped, metrics, risks } = input;

  const slack = `
:rocket: *Product Update*

*What Shipped*
${shipped}

*Metrics*
${metrics}

*Risks & Blockers*
${risks}

_Reply here with any questions or feedback._
`.trim();

  const email = `
Subject: Product Update — What Shipped & What's Next

Hi team,

Here's a quick update on where things stand.

---

*What Shipped*
${shipped}

*Metrics*
${metrics}

*Risks & Next Steps*
${risks}

Let me know if you have any questions.

Best,
[Your Name]
`.trim();

  const executive_summary =
    `We successfully shipped: ${shipped}. ` +
    `Key results show ${metrics}. ` +
    `Current risk to monitor: ${risks}.`;

  return { slack, email, executive_summary };
}

module.exports = { generateUpdates };


// ---------------------------------------------------------------------------
// Usage examples
// ---------------------------------------------------------------------------

// Example 1 — Feature launch
//
// const { generateUpdates } = require('./generator');
// const result = generateUpdates({
//   shipped: 'Launched onboarding redesign and fixed 3 critical bugs',
//   metrics: 'Activation rate up 12%, support tickets down 20%',
//   risks:   'Payment integration delayed 1 week due to third-party API issues'
// });
// console.log(result.slack);
// console.log(result.email);
// console.log(result.executive_summary);

// Example 2 — Sprint update
//
// const result = generateUpdates({
//   shipped: 'Shipped dark mode, improved search relevance, and API v2 docs',
//   metrics: 'P95 latency down from 800ms to 210ms, NPS up 8 points',
//   risks:   'Dark mode has a known issue on Safari 16 — fix targeting next sprint'
// });

// Example 3 — Minimal / early stage
//
// const result = generateUpdates({
//   shipped: 'MVP of the export feature is live for beta users',
//   metrics: 'Early signal: 40% of beta users exported within first session',
//   risks:   'No major risks — monitoring error rates closely this week'
// });