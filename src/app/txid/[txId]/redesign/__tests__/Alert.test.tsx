import { TxDetails } from '@/common/types/tx-v3';
import { system } from '@/ui/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { getFailureDescription, getTxAlert } from '../Alert';

function renderFailureDescription(status: string, vmError: string | null = null) {
  const tx = { tx_id: '0x01', type: 'coinbase', status, vm_error: vmError } as unknown as TxDetails;
  return render(<ChakraProvider value={system}>{getFailureDescription(tx)}</ChakraProvider>);
}

test.each([
  ['abort_by_response', 'aborted during its execution'],
  ['abort_by_post_condition', 'rolled back by a supplied post-condition'],
  ['problematic_skipped', 'marked as problematic by its block, so it was not executed'],
])('describes why a %s transaction failed', (status, reason) => {
  const { container } = renderFailureDescription(status);

  expect(screen.getByText(new RegExp(reason))).toBeInTheDocument();
  expect(container).not.toHaveTextContent(/undefined/);
});

test('falls back to a generic reason for an unrecognized failed status', () => {
  const { container } = renderFailureDescription('some_future_status');

  expect(
    screen.getByText(/^This transaction did not succeed\. A failed transaction/)
  ).toBeInTheDocument();
  expect(container).not.toHaveTextContent(/undefined/);
});

test('shows the VM error when there is one', () => {
  renderFailureDescription('abort_by_response', 'Runtime(DivisionByZero)');

  expect(screen.getByText('VM Error: Runtime(DivisionByZero)')).toBeInTheDocument();
});

describe('getTxAlert', () => {
  const block = {
    height: 100,
    hash: '0xblock',
    index_hash: '0xindex',
    time: 1700000000,
    tx_index: 0,
  };
  const bitcoinBlock = { height: 800, hash: '0xbtc', time: 1700000000 };

  function renderTxAlert(fields: Record<string, unknown>) {
    const tx = {
      tx_id: '0x01',
      type: 'token_transfer',
      vm_error: null,
      ...fields,
    } as unknown as TxDetails;
    return render(<ChakraProvider value={system}>{getTxAlert(tx)}</ChakraProvider>);
  }

  test('warns about a pending transaction', () => {
    renderTxAlert({ status: 'pending', receipt_time: 1700000000 });
    expect(screen.getByText('Transaction taking longer than usual')).toBeInTheDocument();
  });

  test('flags a dropped transaction', () => {
    renderTxAlert({ status: 'dropped_replace_by_fee', receipt_time: 1700000000 });
    expect(screen.getByText('Transaction dropped')).toBeInTheDocument();
  });

  test('explains a failed transaction', () => {
    renderTxAlert({ status: 'abort_by_post_condition', block, bitcoin_block: bitcoinBlock });
    expect(screen.getByText('Transaction failed')).toBeInTheDocument();
  });

  test('shows no alert for a successful transaction', () => {
    const { container } = renderTxAlert({ status: 'success', block, bitcoin_block: bitcoinBlock });
    expect(container).toBeEmptyDOMElement();
  });
});
