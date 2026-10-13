# Staking API v9.6 schedule alignment

- Task ID: staking-v960-schedule-alignment
- Problem Statement: Bond dates and projected bonds use local estimates instead of the new API schedule fields, and timeline labels mix UTC with viewer-local dates.
- Components Involved: Staking data loading, bond types, date resolution, lifecycle cards, bond table, tooltips, timeline, projections, and tests.
- Dependencies: Stacks API v9.6 nullable schedule times, enrollment cutoff, and projected bond detail responses.
- Implementation Checklist:
  - [x] Model schedule fields and projected bonds; fetch upcoming schedule data safely.
  - [x] Resolve schedule heights and dates consistently, retaining fallbacks and available list timestamps.
  - [x] Apply viewer-local dates throughout the timeline and other staking views.
  - [x] Add regression coverage and run verification.
- Verification Steps: Targeted staking tests, typecheck, lint, unit tests, and production build where environment permits.
- Decision Authority: User authorized implementation and explicitly requested viewer-local timezone everywhere.
- Questions/Uncertainties: No blocking questions. API time fields can be null or differ between list and detail; projected terms are unknown.
- Acceptable Tradeoffs: Retain existing block estimates when API dates are absent; retain separately derived milestones the API does not supply.
- Status: Completed
- Notes: Preserve block-height lifecycle decisions and existing user work. Do not publish or deploy as part of this change.

## Verification results

- `pnpm test:unit --runInBand`: 93 suites passed, 1,122 tests passed, 2 skipped, 5 snapshots passed.
- `pnpm typecheck`: passed. Production build also completed TypeScript checking.
- `pnpm lint`: passed with six existing warnings outside staking.
- `pnpm build`: passed with network access for Google Fonts.
- Explicit `TZ=Pacific/Auckland` run: 82 schedule, calendar, and rendering tests passed. Default local test run used America/Denver. Calendar coverage includes the daylight-saving boundary.
- Regression coverage verifies actual/projected timestamps across lifecycle, table, tooltip, and timeline position; authoritative cutoff boundaries; nullable timestamps; list/detail merging; undeclared response handling; partial future-request failures; and timestamp-based elapsed days while preserving height-based lifecycle progress.

## Implementation notes

- Projected bonds stay in the future timeline and next-bond display, separate from declared rates and balances. Requests are bounded to six future indexes and a five-second timeout; failed requests retain local schedule fallbacks.
- API actual times take precedence, then known mined block times, API projections, and finally existing ten-minute estimates. Actual times are unmarked; estimates retain `~`.
- API cutoff replaces the local prepare-phase subtraction when present. Milestones absent from the API retain their existing calculations.
- Local calendar boundaries and client-rendered date text prevent server timezone dates from persisting during hydration. No design-system changes or dependency updates.
