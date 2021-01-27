// @ts-nocheck
import { loadWASM } from 'onigasm'; // peer dependency of 'monaco-textmate'
import { IGrammarDefinition, Registry } from 'monaco-textmate'; // peer dependency
import { wireTmGrammars } from 'monaco-editor-textmate';

export async function liftOff(monaco: any) {
  try {
    await loadWASM(`onigasm.wasm`);
    const registry = new Registry({
      getGrammarDefinition: async scopeName => {
        return {
          format: 'json',
          content: await (await fetch(`clarity.tmLanguage.json`)).text(),
        } as IGrammarDefinition;
      },
    });

    const grammars = new Map();
    grammars.set('clarity', 'source.clarity');
    await wireTmGrammars(monaco, registry, grammars);
    return true;
  } catch (e) {
    console.log(e);
  }
}
