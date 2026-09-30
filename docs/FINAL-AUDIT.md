# Final application audit — 30 September 2026

**Update:** The subsequent [India-first alignment](INDIA-ALIGNMENT.md) makes India / Uttar Pradesh the default, preserves BRICS as secondary samples, and adds optional Vertex AI summary routing. The delivery notes below describe the preceding BRICS expansion.

## Delivered

- 11 BRICS countries, 21 mapped demonstration projects and 179 uniquely identified sample reports. India retains its existing 75 Uttar Pradesh reporting districts; other countries have one sample locality each. This is demonstration coverage, not a nationwide government dataset.
- Country and region filters apply to projects, reports, map bounds, planner portfolios, decision history and evidence exports. Report intake includes country selection and starts in the selected country.
- Both citizen and authority views offer maps. Changing scope fits the map to that scope; selecting a marker opens evidence in the citizen view.
- Replaced hard-coded SY with registration/sign-in, a name-derived initial avatar and sign-out. Passwords use salted scrypt; session tokens are random, hashed in storage, HttpOnly, SameSite=Lax and Secure in production. Sessions expire in seven days and logout revokes them. Origin checks, input limits and per-email attempt throttling protect account mutations.
- Replaced exponential portfolio enumeration with integer-cost dynamic programming. International project costs are explicitly illustrative planning units, not rupees or mixed currencies.
- Corrected certification, data-feed and privacy statements. Web submissions now use the web channel so they appear in that channel's filters.

## Verification

- TypeScript: `npx tsc --noEmit` passed.
- Production build: `npx next build --webpack` passed. Default Turbopack build did not progress beyond compilation in this environment and was cancelled; no default-build success is claimed.
- Targeted ESLint: account UI/API/storage, map and model passed.
- Model checks: all 11 countries have coordinates and sample reports, all report IDs are unique, no duplicate portfolio entries, portfolios respect budgets. Dynamic-programming scores matched exhaustive search on 12-project subsets at budgets 2, 5, 10 and 22.
- Account handler checks using an isolated temporary SQLite database: registration, validation, duplicate-email rejection, password hashing, wrong-password rejection, session restoration, logout/revocation, cross-origin rejection and throttling passed.
- Local HTTP smoke check: `/api/account` returned 200 with an anonymous user; home HTML includes the BRICS scope controls.
- `git diff --check` passed.

## Remaining findings and release limits

1. **Deployment:** citizen accounts require Node.js 22.13+ and a persistent writable `ACCOUNT_DATA_DIR` (default `.data`). The legacy Cloudflare Workers build needs a separate account-storage adapter. Ephemeral/serverless filesystems are not suitable for this SQLite identity store.
2. **Official access:** authority mode and planning-decision endpoints remain an explicitly labelled demonstration. Citizen registration does not verify or authorize government officials. Government production use needs server-enforced official roles.
3. **Account lifecycle:** email ownership verification, password recovery and distributed anti-abuse controls are not implemented.
4. **Data:** national datasets and WhatsApp/IVR/SMS ingestion are not connected. Only web reports are live submissions; benchmark, cost and demographic inputs are synthetic. Hindi and English are the currently supported voice languages.
5. **Existing lint debt:** full-repository ESLint remains failing in the existing page, voice, report/analysis API, D1 declarations and storage code (primarily explicit `any` and React hook/render rules). The new account/map/model modules pass targeted lint.
6. **Visual verification:** browser automation was unavailable (no browser providers). Interactive map tiles, keyboard flows and mobile layout need a browser acceptance check. No visual end-to-end pass is claimed.
7. **Existing report storage:** reports/decisions still inherit the existing in-memory fallback when persistent storage is unavailable. Accounts deliberately fail instead of using a volatile identity store.

Membership reference: https://brics.br/en/about-the-brics (the presidency's 11-country list).
