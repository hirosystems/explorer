import { loadWASM } from 'onigasm';
import { IGrammarDefinition, Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';
import { Monaco } from '@monaco-editor/react';

export async function liftOff(monaco: Monaco, claritySyntax: string) {
  try {
    await loadWASM(`/onigasm.wasm`);
    const registry = new Registry({
      getGrammarDefinition: scopeName =>
        Promise.resolve({
          format: 'json',
          content: claritySyntax,
        } as IGrammarDefinition),
    });

    const grammars = new Map();
    grammars.set('clarity', 'source.clarity');
    await wireTmGrammars(monaco, registry, grammars);
    return true;
  } catch (e) {
    console.log(e);
  }
}
