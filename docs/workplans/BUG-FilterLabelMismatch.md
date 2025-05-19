Task ID: BUG-FilterLabelMismatch
Problem Statement: Filter titles on the transactions page do not match dropdown labels; selecting "Contract deploy" shows "Smart contract" in the filter trigger.
Components Involved: TransactionTypeFilterTriggerText, transactions utils
Dependencies: None
Implementation Checklist:
- [ ] Map transaction type values to labels using existing getTxTypeLabel
- [ ] Update TransactionTypeFilterTriggerText to use mapping
- [ ] Add unit tests covering smart_contract label
- [ ] Ensure dropdown labels match filter titles
- [ ] Run lint, test, and build commands
Verification Steps:
- [ ] pnpm lint
- [ ] pnpm test:unit
- [ ] pnpm build
Decision Authority: Lead engineer may proceed with implementation choices
Questions/Uncertainties:
  Blocking: none
  Non-blocking: none
Acceptable Tradeoffs: Minimal code changes preferred for clarity
Status: Completed
Notes: Using getTxTypeLabel ensures consistent labeling across app.
