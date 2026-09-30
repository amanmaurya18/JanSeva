# Jan Seva — Every street, heard
A working Track 1 prototype for neighbourhood drainage reporting and explainable investment planning in Kanpur.

## Run
Use Node 22+ and pnpm. Install dependencies, generate migrations with `pnpm db:generate`, and run `pnpm dev`. The supplied Sites build uses a Cloudflare Worker and a D1 binding named DB. See starter documentation for local D1 migration setup. Production migrations are packaged in drizzle/.

## Stack and cost
React / Vinext, TypeScript, SQLite-compatible D1, Leaflet, OpenStreetMap, self-hosted Manrope and DM Sans fonts. No paid API is necessary for demo analysis. Cloud deployment quotas are provider-dependent. This is not a guarantee of unlimited free hosting. Respect OpenStreetMap tile usage policy; use a suitable tile provider for larger deployments.

## Optional AI
Set server secrets GEMINI_API_KEY and GEMINI_MODEL to an available Gemini model. The analysis endpoint adds an English summary. Without both values, the UI explicitly labels built-in keyword rules. No API key is sent to the browser. Gemini pricing and account eligibility must be checked before enabling it.

## Data and scope
64 seeded synthetic reports; 6 approximate Kanpur neighbourhood centroids. All household counts, project costs, infrastructure gap and critical-access inputs are illustrative. User reports and planning decisions persist in D1. The demo has no municipal integrations or official role authentication; do not expose write access as a production government service. Site access is private initially. Reports are grouped by neighbourhood, not deduplicated as individuals or events. No citizen count is inferred from report count. Completed projects do not automatically resolve every report.

## Scoring
Demand = min(100, open report count × 5).
Urgency = maximum open report severity / 3 × 100.
Priority = round(0.25 × demand + 0.30 × urgency + 0.25 × synthetic infrastructure gap + 0.20 × synthetic critical access).
Budget planning exhaustively evaluates 64 portfolios and maximises total priority score within the chosen budget. Baseline selects highest-report-count projects first. Displayed comparison uses synthetic inputs and does not claim actual impact.

## Three-minute demonstration
1. Open Overview and inspect Govind Nagar's evidence.
2. Submit a Hindi drainage complaint mentioning a school; review disclosed rule analysis and confirm submission.
3. Find the saved reference under Citizen reports and inspect the updated project score.
4. Change the Project planner budget and compare the selected portfolio.
5. Review a project, record a decision note, then open Impact & evidence to see the audit trail and baseline comparison.

## Next production steps
Verified municipal identity and role authorization, privacy review and retention controls, anti-spam and duplicate validation, multilingual model evaluation, actual ward / asset / budget datasets, field verification, community accessibility testing, real impact measurement. The app is an open-source candidate, not a certified Digital Public Good.

Design references supplied by the user: dickwu/apple-design-skill, Leonxlnx/taste-skill, VoltAgent/awesome-design-md. Layout uses restrained surfaces, readable type hierarchy, accessible forms and progressive disclosure.


## Uttar Pradesh and separate interfaces
The app opens in the citizen interface. Use the header selector or `?interface=authority` for the government authority demonstration interface. This is UI separation, not authenticated role-based authorization. Existing workspace access is unchanged.

Reporting covers 75 districts via a district and locality selector. Eleven sample projects span Kanpur Nagar, Lucknow, Varanasi, Agra, Gorakhpur and Meerut. Other districts accept reports but require field assessment before mapped project recommendations. No coordinates or costs are invented for those reports.

The prominent voice-navigation control supports Hindi and English commands, spoken confirmation and large tap shortcuts. It requires browser SpeechRecognition for speech input and never submits complaints automatically. About Jan Seva includes screenshots captured from the actual application.
