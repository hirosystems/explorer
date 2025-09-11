'use client';

export function convertUnicodeToAscii(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function splitStxAddressIntoParts(address: string): string[] {
  const parts: string[] = [];
  for (let i = 0; i < address.length; i += 4) {
    parts.push(address.slice(i, i + 4));
  }

  // If the last piece is less than 4 characters, append it to the previous piece
  if (parts.length > 1 && parts[parts.length - 1].length < 4) {
    const lastPiece = parts.pop()!;
    parts[parts.length - 1] += lastPiece;
  }

  return parts;
}
