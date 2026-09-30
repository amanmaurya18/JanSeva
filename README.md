# Jan Seva — Every street, heard
An India-first digital public infrastructure prototype for Build with AI: Code for Communities. Residents report local problems in Hindi or English; Gemini can summarise their reports, while transparent rules help local teams prioritise field verification. The initial pilot covers Uttar Pradesh, with optional BRICS reference samples.

## Run
Use Node 22.13+ and pnpm. The Next.js app and citizen account service run on Node.js with persistent writable storage. Install dependencies, generate migrations with `pnpm db:generate`, and run `pnpm dev`. The legacy Sites build uses a Cloudflare Worker and a D1 binding named DB; the new Node SQLite account service requires a Node deployment and is not compatible with that Workers build without an authentication storage adapter. See starter documentation for local D1 migration setup. Production migrations are packaged in drizzle/.

## Stack and cost
Next.js / React, TypeScript, Node SQLite (legacy D1 integration retained), Leaflet, OpenStreetMap, self-hosted Manrope and DM Sans fonts. No paid API is necessary for demo analysis. Cloud deployment quotas are provider-dependent. This is not a guarantee of unlimited free hosting. Respect OpenStreetMap tile usage policy; use a suitable tile provider for larger deployments.

## Optional AI
For Google Cloud, configure `VERTEX_API_KEY` and `VERTEX_MODEL` for an enabled express-mode Gemini model. The server calls `aiplatform.googleapis.com/v1/publishers/google/models/{model}:generateContent`. Alternatively, use `GEMINI_API_KEY` and `GEMINI_MODEL` for the Gemini Developer API. A selected Vertex configuration takes precedence and never silently sends data to the other provider.

The citizen home displays provider configuration status (not a live connectivity claim). Review shows which method actually ran. Gemini summarises the report in English; deterministic rules still determine category and severity. Errors, blocked/empty output or incomplete responses return the original text with an explicitly labelled rule-only fallback. API keys remain server-side. The report form discloses that Google receives report text when AI is configured.

The hackathon requires functioning Google AI integration. Rule-only fallback is useful for development but is not evidence of meeting that requirement. Before submission, configure an authorised model and record a successful live summary in the deployed demo. Provider request/response handling is covered by mocked tests; no live cloud call was made during this alignment pass.

Reference: [Google Cloud express-mode setup](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/vertex-ai-express-mode-api-quickstart).

## Data and scope
179 seeded synthetic reports; 21 mapped neighbourhood projects across Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, Indonesia, Iran, Saudi Arabia and the United Arab Emirates. Country membership follows https://brics.br/en/about-the-brics. India retains 75 Uttar Pradesh reporting districts; other countries have one mapped sample locality each, not nationwide coverage. All household counts, project costs, infrastructure gap and critical-access inputs are illustrative. User reports and planning decisions use the configured D1 or local SQLite storage; the existing fallback is in memory when persistent storage is unavailable. The demo has no municipal integrations or official role authentication; do not expose write access as a production government service. Site access is private initially. Reports are grouped by neighbourhood, not deduplicated as individuals or events. No citizen count is inferred from report count. Completed projects do not automatically resolve every report.

## Scoring
Demand = min(100, open report count × 5).
Urgency = maximum open report severity / 3 × 100.
Priority = round(0.25 × demand + 0.30 × urgency + 0.25 × synthetic infrastructure gap + 0.20 × synthetic critical access).
Budget planning uses integer-cost dynamic programming and maximises total priority score within the chosen budget. Costs use illustrative planning units, not local currencies or exchange-rate equivalents. Baseline selects highest-report-count projects first. Displayed comparison uses synthetic inputs and does not claim actual impact.

## Three-minute demonstration
1. Open the India / Uttar Pradesh default view and describe the citizen-feedback problem under Track 1: AI for Digital Public Infrastructure & Governance.
2. Submit a Hindi drainage complaint mentioning a school. Demonstrate a configured Google AI summary, inspect the disclosed rule-based severity and confirm submission.
3. Find the saved reference under Citizen reports and inspect the updated project score.
4. Change the Project planner budget and compare the selected portfolio.
5. Review a project, record a decision note, then open Impact & evidence to see the audit trail and baseline comparison.

## Next production steps
Verified municipal identity and role authorization, privacy review and retention controls, anti-spam and duplicate validation, multilingual model evaluation, actual ward / asset / budget datasets, field verification, community accessibility testing, real impact measurement. The app is an open-source candidate, not a certified Digital Public Good.

Design references supplied by the user: dickwu/apple-design-skill, Leonxlnx/taste-skill, VoltAgent/awesome-design-md. Layout uses restrained surfaces, readable type hierarchy, accessible forms and progressive disclosure.


## Uttar Pradesh and separate interfaces
The app opens in the citizen interface with India selected and the map fitted to the Uttar Pradesh sample projects. International samples are grouped separately as optional reference demos. Use the header selector or `?interface=authority` for the government authority demonstration interface. This is UI separation, not authenticated role-based authorization. Existing workspace access is unchanged.

Reporting covers 75 districts via a district and locality selector. Eleven sample projects span Kanpur Nagar, Lucknow, Varanasi, Agra, Gorakhpur and Meerut. Other districts accept reports but require field assessment before mapped project recommendations. No coordinates or costs are invented for those reports.

The prominent voice-navigation control supports Hindi and English commands, spoken confirmation and large tap shortcuts. It requires browser SpeechRecognition for speech input and never submits complaints automatically. About Jan Seva explains the pilot scope, working features, illustrative data and expansion path across Indian communities.

## Citizen accounts
Sign up with a name, email and password (12–128 characters). The header shows initials from the first and last name; sign-in and sign-out are available from the same control. Passwords use salted scrypt; opaque sessions are stored hashed and sent in HttpOnly, SameSite=Lax cookies (Secure in production), expire after seven days, and are revoked at logout. Account mutations require a matching Origin. Failed attempts are limited per email.

Accounts persist in `.data/accounts.sqlite`; set `ACCOUNT_DATA_DIR` to a persistent volume for deployment. No volatile fallback is used for identities. Email verification, password recovery and distributed anti-abuse protection are not implemented. Accounts are citizen identities, not verified government roles.

## Alignment verification
Run `node tests/analysis.mjs` for isolated API and pilot-data checks, `npx tsc --noEmit` for types, and `npx next build --webpack` for a production build. The test uses mocked Google responses and never makes live API calls. See [the alignment note](docs/INDIA-ALIGNMENT.md) for remaining submission requirements.
