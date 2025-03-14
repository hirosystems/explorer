export function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);

  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  let seconds = date.getUTCSeconds();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${hours}:${paddedMinutes}:${paddedSeconds} ${ampm} (UTC)`;
}
