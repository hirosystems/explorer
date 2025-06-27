# Memory Impact Test Results

## Test Configuration
- **Duration**: 5 minutes per test
- **Sample Rate**: Every 5 seconds (60 samples)
- **Environment**: Development server with active WebSocket connections
- **Activity**: Multiple browser tabs with WebSocket subscriptions (/, /blocks, /transactions, /mempool)

## Results Summary

| Metric | Baseline (No Fix) | With WebSocket Fix | Improvement |
|--------|-------------------|-------------------|-------------|
| **Total Memory Growth** | 7.23 MB | 0.09 MB | **98.7% reduction** |
| **Growth Rate** | 88.28 MB/hour | 1.14 MB/hour | **98.7% reduction** |
| **Projected Daily Growth** | 2,119 MB | 27.5 MB | **98.7% reduction** |
| **Time to 500MB Growth** | 5.7 hours | 437.5 hours (18 days) | **77x improvement** |

## Analysis

The WebSocket cleanup fix in `useSubscribeTxs.ts` shows a dramatic improvement:

- **Baseline**: Without proper cleanup, memory grows at ~88 MB/hour due to accumulating WebSocket subscriptions
- **With Fix**: Memory growth is minimal at ~1.14 MB/hour, representing normal application overhead
- **Impact**: The fix prevents 98.7% of the memory leak, extending container lifetime from hours to weeks

## Raw Data

### Baseline Test (No Fix)
```json
{
  "testName": "baseline-no-fix",
  "duration": 300,
  "samples": 60,
  "startRss": 617.47,
  "endRss": 624.70,
  "totalGrowth": 7.23,
  "growthRatePerHour": 88.28
}
```

### With WebSocket Fix
```json
{
  "testName": "with-websocket-fix",
  "duration": 300,
  "samples": 60,
  "startRss": 624.91,
  "endRss": 625.00,
  "totalGrowth": 0.09,
  "growthRatePerHour": 1.14
}
``` 