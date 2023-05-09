export async function fetchVersionNumber(): Promise<string> {
  const response = await fetch('https://api.github.com/repos/hirosystems/explorer/releases');
  const jsonData = await response.json();
  return jsonData[0].tag_name;
}
