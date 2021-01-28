// @ts-nocheck
import { clarity } from '@sandbox/common/clarity-reference';
import { Monaco } from '@monaco-editor/react';

export function autocomplete(monaco: Monaco) {
  // @ts-ignore
  const provider = {
    triggerCharacters: ['(', "'", '"', ' '],
    provideCompletionItems: (model, position) => {
      // // Get all the text content before the cursor
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const fullRange = model.getFullModelRange();
      const text = model.getValueInRange(fullRange);
      const lines = text.split('\n');
      const nfts = new Set([]);
      const fts = new Set([]);
      const functions = new Set([]);
      const principals = new Set([]);

      const getToken = (line, replacer) =>
        line
          .replace(`${replacer}`, '')
          .split(' ')
          .map(t => t.replace(new RegExp(/\)/, 'g'), ''))
          .filter(t => t !== ' ')
          .filter(t => t !== '')
          .filter(t => t)[0];

      const DEFINE_NFT = `(define-non-fungible-token`;
      const DEFINE_FT = `(define-fungible-token`;
      const DEFINE_PUBLIC = `(define-public (`;
      const DEFINE_READ_ONLY = `(define-read-only (`;

      lines.forEach(line => {
        if (line.includes(" '")) {
          const token = line.split(" '").map(t => t.replace(new RegExp(/\)/, 'g'), ''))[1];
          if (token) {
            principals.add(token);
          }
        }
        if (line.includes(DEFINE_NFT)) {
          const token = getToken(line, `${DEFINE_NFT} `);
          if (token) {
            nfts.add(token);
          }
        }
        if (line.includes(DEFINE_FT)) {
          const token = getToken(line, `${DEFINE_FT} `);
          fts.add(token);
        }
        if (line.includes(DEFINE_PUBLIC)) {
          const token = getToken(line, `${DEFINE_PUBLIC}`);
          functions.add(token);
        }
        if (line.includes(DEFINE_READ_ONLY)) {
          const token = getToken(line, `${DEFINE_READ_ONLY}`);
          functions.add(token);
        }
      });

      if (
        textUntilPosition.match(
          /(nft-get-balance|nft-get-supply|nft-mint|nft-burn|nft-get-owner|nft-transfer)\?\s$/
        ) &&
        [...nfts].length > 0
      ) {
        return {
          suggestions: [...nfts].map(nft => ({
            label: nft,
            insertText: nft,
            kind: monaco.languages.CompletionItemKind.Constant,
          })),
        };
      }
      if (
        textUntilPosition.match(
          /(ft-get-balance|ft-get-supply|ft-mint|ft-burn|ft-get-owner|ft-transfer)\?\s$/
        ) &&
        [...fts].length > 0
      ) {
        return {
          suggestions: [...fts].map(nft => ({
            label: nft,
            insertText: nft,
            kind: monaco.languages.CompletionItemKind.Constant,
          })),
        };
      }

      if (textUntilPosition.endsWith('(')) {
        return {
          suggestions: clarity.functions.map(func => ({
            label: func.name,
            detail: func.input_type,
            documentation: func.description,
            insertText: func.name.split(' ')[0],
            kind: monaco.languages.CompletionItemKind.Function,
          })),
        };
      }

      return;
    },
  };
  monaco.languages.registerCompletionItemProvider('clarity', provider);
}

export function hover(monaco: Monaco) {
  monaco.languages.registerHoverProvider('clarity', {
    provideHover: function (model: any, position: any) {
      const word = model.getWordAtPosition(position);
      const hyphenWordPattern = new RegExp(/((?:\w+-)+\w+)/, 'g');
      const wordsWithHyphens: string[] = [
        ...new Set([
          ...[...model.getLineContent(position.lineNumber).matchAll(hyphenWordPattern)].flat(),
        ]),
      ];

      const token =
        (word?.word && wordsWithHyphens?.find(t => t.includes(word.word))) || word?.word;

      const functions = clarity.functions.find(
        func => func.name === token || func.name === `${token}?`
      );

      if (functions) {
        const foundWord =
          model.findMatches(`${token}?`).find(i => {
            if (i.range.startLineNumber === position.lineNumber) {
              if (position.column >= i.range.startColumn && position.column <= i.range.endColumn) {
                return true;
              }
            }
          }) ||
          model.findMatches(`${token}`).find(i => {
            if (i.range.startLineNumber === position.lineNumber) {
              if (position.column >= i.range.startColumn && position.column <= i.range.endColumn) {
                return true;
              }
            }
          });
        if (!foundWord) return;
        return {
          range: foundWord?.range || undefined,
          contents: [
            { value: `**${functions.name}**` },
            functions.input_type !== 'Not Applicable'
              ? { value: `**Input type** \`${functions.input_type}\`` }
              : null,
            functions.output_type !== 'Not Applicable'
              ? { value: `**Output type** \`${functions.output_type}\`` }
              : null,
            { value: `**Signature** \`${functions.signature}\`` },
            { value: functions.description },
          ].filter(t => t),
        };
      }

      const keywords = clarity.keywords.find(keyword => keyword.name === token);
      if (keywords) {
        const foundWord = model.findMatches(`${token}`).find(i => {
          if (i.range.startLineNumber === position.lineNumber) {
            if (position.column >= i.range.startColumn && position.column <= i.range.endColumn) {
              return true;
            }
          }
        });
        if (!foundWord) return;
        return {
          range: foundWord?.range || undefined,
          contents: [
            { value: `**${keywords.name}**` },
            keywords.output_type !== 'Not Applicable'
              ? { value: `**Output type** \`${keywords.output_type}\`` }
              : null,
            { value: `\`${keywords.example}\`` },
            { value: keywords.description },
          ].filter(t => t),
        };
      }

      return;
    },
  } as any);
}
