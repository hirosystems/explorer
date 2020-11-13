import React from 'react';
import dynamic from 'next/dynamic';
import { Box, color, Flex, Fade } from '@stacks/ui';
import { atom, useRecoilState } from 'recoil';
import { useClarityRepl } from '@common/hooks/use-clarity-repl';
import { AlertTriangleIcon } from '@components/icons/alert-triangle';
import { CheckCircleIcon } from '@components/icons/check-circle';
import { IconButton } from '@components/icon-button';
import CloseIcon from 'mdi-react/CloseIcon';
import { clarityWasmAtom } from '@store/sandbox';

const capitalize = (s: string) => {
  return s?.charAt(0).toUpperCase() + s?.slice(1);
};

const ClarityRepl = React.memo(({ show }: { show?: boolean }) => {
  const { result, setResult } = useClarityRepl();

  const [visible, setVisible] = React.useState(!!result);
  const [exiting, setExiting] = React.useState(false);

  React.useEffect(() => {
    if (!visible && !!result && !exiting) {
      setVisible(true);
    }
  }, [visible, result]);

  const handleClose = () => {
    setExiting(true);
    setVisible(false);
  };

  return (
    <Fade
      in={show && visible && !!result}
      onExited={() => {
        setTimeout(() => {
          // setResult(undefined);
          setExiting(false);
        }, 250);
      }}
    >
      {styles => (
        <Box
          // width="calc(100% - 16px)"
          right="tight"
          top="122px"
          position="absolute"
          zIndex={99999}
          p="base"
          style={styles}
          willChange="opacity"
        >
          {/*<Box*/}
          {/*  position="absolute"*/}
          {/*  top="10px"*/}
          {/*  right="153px"*/}
          {/*  transform="rotate(45deg)"*/}
          {/*  size="10px"*/}
          {/*  bg={result?.valid ? color('feedback-success') : color('feedback-error')}*/}
          {/*/>*/}
          <Flex
            transform="translateY(-1px)"
            bg={result?.valid ? color('feedback-success') : color('feedback-error')}
            borderRadius="8px"
            py="tight"
            px="base"
            alignItems="center"
            height="48px"
          >
            {result?.valid ? (
              <Flex alignItems="center" flexGrow={1} color="white">
                <Flex
                  alignItems="center"
                  fontSize="14px"
                  fontWeight="600"
                  color="ink.400"
                  pr="tight"
                >
                  <CheckCircleIcon color="white" size="20px" />
                </Flex>
                <Box fontSize="14px">Compiled successfully, no errors found!</Box>
              </Flex>
            ) : (
              <Flex alignItems="center" flexGrow={1} color="white">
                <Flex alignItems="center" fontSize="14px" fontWeight="600" color="white" pr="tight">
                  <AlertTriangleIcon
                    transform="translateY(1px)"
                    mr="extra-tight"
                    color="white"
                    size="20px"
                  />
                  <Box transform="translateY(1px)">{result?.error?.name}</Box>
                </Flex>
                <Box fontSize="14px" transform="translateY(1px)">
                  {result?.error?.message ? capitalize(result.error.message) : null}
                  {result?.error?.line && result?.error?.line !== -1
                    ? ` See line #${result.error.line}`
                    : ''}
                </Box>
              </Flex>
            )}
            <IconButton ml="base" onClick={handleClose} size="28px" icon={CloseIcon} />
          </Flex>
        </Box>
      )}
    </Fade>
  );
});

export const WasmComponent = dynamic(
  {
    loader: async () => {
      const response = await fetch('/clarity_repl.wasm');
      const buf = await response.arrayBuffer();
      const rustModule = await WebAssembly.instantiate(buf);
      return ({ show }: { show?: boolean }) => {
        const [wasm, setWasm] = useRecoilState(clarityWasmAtom);
        const { result } = useClarityRepl();
        const isBrowser = typeof window !== 'undefined';
        React.useEffect(() => {
          try {
            if (isBrowser && !wasm && rustModule) {
              setWasm(rustModule.instance.exports as any);
            }
          } catch (e) {
            console.log(e);
          }
        }, [wasm, rustModule, isBrowser]);
        return <ClarityRepl show={show} />;
      };
    },
  },
  { ssr: false }
);
