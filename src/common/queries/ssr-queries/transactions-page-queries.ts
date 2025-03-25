export async function getTransactionsPageData(apiUrl: string) {
  const response = await fetch(`${apiUrl}/extended/v1/tx/`);
  const data = await response.json();
  return data;
}

