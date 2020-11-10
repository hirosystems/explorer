//@ts-nocheck

import { useRecoilValue, useRecoilState } from 'recoil';
import { clarityWasmAtom, replResultState } from '@components/sandbox/state/atoms';

const getErrorMessage = (raw: string): { name: string; message: string; line: number } => {
  const arr = raw?.split('\n');
  const sections = arr?.[0]?.split(': ');
  const name = sections?.[0]?.replace(/\[1;31m/, '');
  const message = sections?.[1]?.replace(/\[0m/, '').trim();

  const errorLine = arr?.findIndex(line => line.includes('[1;4;31m'));

  return {
    name,
    message,
    line: errorLine,
  };
};
interface Result {
  raw: string;
  valid?: boolean | null;
  error?: { name: string; message: string; line: number };
}
interface UseClarityRepl {
  handleCommand: (clarityCode: string) => string;
  handleValidate: (clarityCode: string) => Result;
  result?: Result;
  setResult: any;
  wasmLoaded?: boolean;
}
export const useClarityRepl = (): UseClarityRepl => {
  const wasm = useRecoilValue(clarityWasmAtom);
  const [result, setResult] = useRecoilState(replResultState);

  let cachegetUint8Memory0 = null;
  let WASM_VECTOR_LEN = 0;
  let cachedTextEncoder = new TextEncoder('utf-8');
  let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
  let cachegetInt32Memory0 = null;

  function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
      cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
  }

  const encodeString =
    typeof cachedTextEncoder.encodeInto === 'function'
      ? function (arg, view) {
          return cachedTextEncoder.encodeInto(arg, view);
        }
      : function (arg, view) {
          const buf = cachedTextEncoder.encode(arg);
          view.set(buf);
          return {
            read: arg.length,
            written: buf.length,
          };
        };

  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr = malloc(buf.length);
      getUint8Memory0()
        .subarray(ptr, ptr + buf.length)
        .set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 0x7f) break;
      mem[ptr + offset] = code;
    }

    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, (len = offset + arg.length * 3));
      const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
      const ret = encodeString(arg, view);

      offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
  }

  function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
      cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
  }

  function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }

  function handle_command(snippet: string) {
    try {
      var ptr0 = passStringToWasm0(snippet, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len0 = WASM_VECTOR_LEN;
      wasm.handle_command(8, ptr0, len0);
      var r0 = getInt32Memory0()[8 / 4 + 0];
      var r1 = getInt32Memory0()[8 / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_free(r0, r1);
    }
  }

  const handleValidate = (source: string): undefined | Result => {
    if (!wasm) {
      return { raw: undefined, valid: null };
    }
    const raw = handle_command(source);
    let result: Result | undefined = undefined;
    if (raw.includes('successfully')) {
      result = {
        raw,
        valid: true,
      };
    } else if (raw.includes('error')) {
      const error = getErrorMessage(raw);
      result = {
        raw,
        valid: false,
        error,
      };
    } else {
      result = {
        raw,
        valid: null,
      };
    }
    setResult(result);
    return result;
  };

  return { handleCommand: handle_command, handleValidate, result, setResult, wasmLoaded: !!wasm };
};
