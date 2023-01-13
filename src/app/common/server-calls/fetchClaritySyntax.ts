export async function fetchClaritySyntax() {
  const response = await fetch(
    'https://raw.githubusercontent.com/hirosystems/clarinet/main/components/clarity-vscode/syntaxes/clarity.tmLanguage.json'
  );
  return response.text();
}
