Task ID: FEAT-RelativeTimeDisplay
Problem Statement: Existing relative time formatting displays long strings below a minute and the prop name timestampInMs is misleading. Need to display '<1 minute ago' and rename prop for clarity.
Components Involved: RelativeTimeDisplay component, utils.ts locale config, UpdateBar, Timestamp, unit tests.
Dependencies: dayjs locale configuration, React components.
Implementation Checklist:
- [ ] Update dayjs locale relativeTime.s to '<1 minute' and past to always append ' ago'.
- [ ] Modify RelativeTimeDisplay to render '<1 minute ago' when diff < 60.
- [ ] Rename prop timestampInMs to timestampInSeconds across the codebase.
- [ ] Update affected components and tests.
- [ ] Add unit test ensuring toRelativeTime(<date within 60s>) returns '<1 minute ago'.
- [ ] Run pnpm lint, pnpm test:unit, pnpm build.
Verification Steps:
- [ ] Observe UI shows '<1 minute ago' for recent timestamps.
- [ ] Unit tests including new test pass.
- [ ] Build succeeds.
Decision Authority: Lead engineer can decide on implementation details.
Questions/Uncertainties:
- Blocking: None.
- Non-blocking: Are there any external dependencies relying on prop naming? Assume no.
Acceptable Tradeoffs: Minor API change to prop name is acceptable.
Status: Completed
Notes:
- Workplan created per instructions.
