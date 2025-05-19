# 2216 - Homepage Block Timestamps

## Problem Statement
Timestamps in the Recent Blocks widget show values from the previously selected network when switching between mainnet and testnet. Briefly stale data appears until the new network data loads which causes a flicker.

## Components Involved
- `src/common/queries` hooks fetching block data
- `src/common/context/GlobalContextProvider`
- Home page block list components

## Dependencies
- React Query cache
- Global network context

## Implementation Checklist
- [ ] Add active network identifier to query keys of block related hooks
- [ ] Clear query cache on network change to avoid stale renders
- [ ] Provide unit tests for query key helpers
- [ ] Verify lint, unit tests and build succeed

## Verification Steps
1. Switch between mainnet and testnet and observe that block timestamps update without showing old values.
2. Automated unit tests pass.

## Decision Authority
Hiro Systems engineering lead

## Questions / Uncertainties
None

## Acceptable Tradeoffs
Clearing the entire query cache on network change may refetch unrelated data but keeps logic simple.

## Status
In Progress

## Notes
Initial workplan created by automated agent.
