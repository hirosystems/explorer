/**
 * Get value from the provided `options` based on the hash of `source`.
 *
 * @param source String to hash.
 * @param options Collection of options to get value from.
 */

export const generateHash = (source: string) => {
  let hash = 0;

  for (let i = 0; i < source.length; i++) {
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return hash;
};
export function hashValue(source: string, options: any[]) {
  let hash = generateHash(source);

  hash = ((hash % options.length) + options.length) % options.length;

  return options[hash];
}
