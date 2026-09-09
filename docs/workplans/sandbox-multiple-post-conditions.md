# Workplan: Support Multiple Sandbox Post-conditions

## Task ID

Untracked

## Problem Statement

The contract-call sandbox stores, validates, and submits one flat post-condition definition. Many
contract calls transfer more than one asset or involve more than one principal, so users cannot
describe every permitted transfer in deny or originator mode.

## Components Involved

- `src/app/sandbox/components/ContractCall/FunctionView.tsx` - Form state, validation, and wallet submission
- `src/app/sandbox/components/ContractCall/PostConditionForm.tsx` - Post-condition fields and list controls
- `src/app/sandbox/components/ContractCall/__tests__/` - Builder, validation, and UI regression coverage
- `src/common/components/Select.tsx` - Controlled selection support for indexed form rows

## Dependencies

No new dependencies. Formik already provides `FieldArray`, and the wallet request already accepts an
array of post conditions.

## Implementation Checklist

- [x] Replace the flat post-condition fields with a transaction mode and post-condition array
- [x] Validate every configured post condition and associate errors with its indexed fields
- [x] Serialize and submit every valid post condition in list order
- [x] Add accessible add/remove controls and visually group each condition
- [x] Keep post conditions available in allow, originator, and deny modes
- [x] Preserve uint128 amount input without JavaScript number precision loss
- [x] Add focused unit and component tests
- [x] Run lint, unit tests, and production build

## Verification Steps

1. Add two post conditions of different types and confirm both remain independently editable.
2. Remove the first condition and confirm the remaining values and select labels stay synchronized.
3. Submit a public function and confirm every configured condition is passed to the wallet request.
4. Confirm validation identifies the index and field of each invalid condition.
5. Run `pnpm lint`, `pnpm test:unit`, and `pnpm build`.

## Decision Authority

- Self-directed: Form state, validation structure, component boundaries, accessibility, and tests.
- User-led: Any broader redesign of the sandbox or change to wallet signing behavior beyond supporting
  the submitted post-condition array.

## Questions/Uncertainties

### Non-blocking

- The sandbox does not currently constrain the number of post conditions. The protocol encoding uses
  an array, so this change will not add an arbitrary UI-only maximum.

## Acceptable Tradeoffs

- Each new condition starts empty instead of guessing a type or principal.
- The post-condition mode remains transaction-wide because that is how Stacks transactions encode it.

## Status

Completed

## Notes

- An empty list remains valid in every mode, preserving the current ability to submit without a post
  condition.
- Allow mode permits unrelated transfers while still enforcing any listed post conditions, so the
  list editor remains visible in that mode.
- Validation passed with 749 unit tests, repository lint and formatting, TypeScript, and the
  production build.
