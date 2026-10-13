# Staking lifecycle highlight

- Task ID: staking-lifecycle-highlight
- Problem Statement: During an active bond, the lifecycle highlights the completed start milestone instead of the next scheduled distribution.
- Components Involved: `src/app/staking/CurrentBond.tsx`.
- Dependencies: Existing milestone state and design-system colors.
- Implementation Checklist:
  - [x] Move the active highlight from bond start to the next scheduled distribution.
  - [x] Verify formatting, lint, and existing lifecycle regression tests.
- Verification Steps: File-level ESLint and Prettier checks; existing staking rendering regression suite.
- Decision Authority: User requested green for the completed start and orange for the next distribution.
- Questions/Uncertainties: None.
- Acceptable Tradeoffs: Reuse the existing completed and current marker styles.
- Status: Completed
- Notes: Preserve the existing enrollment and maturity highlights. No new styles or tests are needed for this small presentation change.
- Verification Results: File-level ESLint and Prettier checks passed; all 12 existing rendering regression tests passed.
