export function getReadableTimestamp(ts: number): string {
  return ts
    ? `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(ts * 1000).toLocaleDateString()}`
    : '';
}
