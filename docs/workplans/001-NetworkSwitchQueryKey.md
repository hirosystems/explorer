Task ID: 001

Problem Statement:
The Recent Blocks timestamps briefly show stale data after switching networks because the useBlockTxsInfinite query cache is keyed only by blockHash. React Query reuses cached data for a different network until refetched, leading to visual glitches. Additionally, several components under src/app/signers require the 'use client' directive but currently omit it, causing runtime errors when Chakra hooks run on the client.

Components Involved:
- src/common/queries/useBlockTxsInfinite.ts
- src/app/signers/SignersMap.tsx
- src/app/signers/SignersMapComponent.tsx
- src/app/signers/CurrentCycleCard.tsx
- src/common/queries/__tests__
- e2e tests

Dependencies:
- React Query
- Global context for network state

Implementation Checklist:
- [x] Add helper getBlockTxsQueryKey(blockHash, activeNetworkKey).
- [x] Use useGlobalContext within hooks to include network key in queryKey.
- [x] Add unit test validating helper output.
- [x] Create e2e test covering network switch timestamps.
- [x] Add 'use client' directive to Signers components.
- [x] Update docs if necessary.

Verification Steps:
- Run `pnpm lint`.
- Run `pnpm test:unit`.
- Run `pnpm build`.
- Run `pnpm test:e2e`.

Decision Authority: Lead engineer.

Questions/Uncertainties:
- None.

Acceptable Tradeoffs:
- E2E test checks timestamp inequality but cannot detect brief flashes.

Status: Completed

Notes:
Implemented as per plan and tests pass.
