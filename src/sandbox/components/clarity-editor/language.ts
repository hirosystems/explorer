// @ts-nocheck
export function configLanguage(monaco: any) {
  monaco.languages.register({ id: 'clarity' });
  monaco.languages.setLanguageConfiguration('clarity', {
    comments: {
      lineComment: ';;',
    },
    brackets: [['(', ')']],
    autoClosingPairs: [
      {
        open: '(',
        close: ')',
      },
      {
        open: '"',
        close: '"',
      },
      {
        open: '{',
        close: '}',
      },
    ],
    surroundingPairs: [
      { open: '(', close: ')' },
      {
        open: '{',
        close: '}',
      },
      { open: '"', close: '"' },
    ],
  });
}
