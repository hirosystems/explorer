'use client';

export function convertUnicodeToAscii(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function splitStxAddressIntoParts(address: string): string[] {
  const parts: string[] = [];
  for (let i = 0; i < address.length; i += 4) {
    parts.push(address.slice(i, i + 4));
  }
  return parts;
}