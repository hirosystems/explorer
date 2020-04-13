import Router from 'next/router';

export function search(query: string) {
  return async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim().length) return;
    await Router.push('/txid/' + query);
  };
}
