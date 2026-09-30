# India-first alignment

The app is positioned around **Track 1: AI for Digital Public Infrastructure & Governance** in the supplied Code for Communities brief. It does not claim to solve the separate agriculture, health-supply-chain or air-quality tracks. Health-centre access and monsoon drainage are examples of the infrastructure use case.

## Product changes

- India / Uttar Pradesh is the default scope; map, reports, priorities and exports follow that scope.
- The citizen overview explains the local problem through drainage, health-centre access and school-route examples. Hindi and English reporting and voice navigation remain prominent.
- Eleven sample projects in six Uttar Pradesh districts, with reporting intake across all 75 districts. This is a prototype coverage statement, not statewide service delivery.
- International BRICS samples remain available as a secondary reference demonstration.
- About, metadata, evidence labels and exports distinguish resident submissions, synthetic data, rule-based scores and optional AI summaries.
- Report intake starts in the selected district; submitting in another locality updates the scope so the new reference can be found.
- Optional Google Cloud Vertex AI express-mode support complements the existing Gemini Developer API. Configuration status is visible; only a successfully returned summary is labelled AI-assisted. No client-side secrets.

## What is still needed for submission

- Configure and verify a live Google AI summary on the deployed application. Mocked integration tests and rule-only fallback do not establish this requirement.
- Deploy on infrastructure compatible with persistent Node SQLite accounts, or add a managed authentication/storage adapter. Current authority mode remains a demonstration rather than verified official access.
- Prepare the repository link, deployed link, short description, 3–5 minute demonstration video and 10–12 slide pitch deck. These assets are outside this app-alignment change.
- For a real pilot: connect authorised Indian demographic/infrastructure/investment datasets, validate ranking inputs with local teams, add real messaging ingestion, evaluate additional Indian languages and enforce official roles. No nationwide scale or measured impact is claimed.

## Checks

- `node tests/analysis.mjs`: passes mocked Gemini and Vertex routing, missing/partial configuration, error and incomplete-output fallback, input validation, origin rejection, safe public configuration status and India pilot counts.
- `npx tsc --noEmit`: passed.
- Targeted ESLint on the new overview component, analysis API, map and model: passed.
- `npx next build --webpack`: passed. Generated production HTML was checked for India/all Uttar Pradesh defaults and the revised mission, map heading and community use cases.
- Native Chrome was available, but repeated browser interaction interruptions prevented a completed visual walkthrough. No visual/mobile acceptance pass is claimed.

References: [event brief](https://hack2skill.com/event/codeforcommunities2), [Google Cloud express-mode setup](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/vertex-ai-express-mode-api-quickstart).
