import { TxDetails } from '@/common/types/tx-v3';
import { system } from '@/ui/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { getFailureDescription } from '../Alert';

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
