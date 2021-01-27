// @ts-nocheck
export function configLanguage(monaco: any) {
  monaco.languages.register({
    id: 'clarity',
    extensions: ['.clar'],
    configuration: {
      wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
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
    },
  });
}
