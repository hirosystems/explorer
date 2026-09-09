import { renderWithProviders } from '@/common/utils/test-utils/render-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClarityAbiFunction, FungibleConditionCode, PostConditionType } from '@stacks/transactions';

import { callContract } from '../../../utils/walletTransactions';
import { FunctionView } from '../FunctionView';

jest.mock('@/common/components/Select', () => ({
  Select: ({ defaultValue, items, label, onValueChange, placeholder, value }: any) => (
    <label>
      {label}
      <select
        aria-label={label}
        value={value?.[0] ?? defaultValue?.[0] ?? ''}
        onChange={event => onValueChange?.({ value: [event.target.value] })}
      >
        <option value="">{placeholder}</option>
        {items.map((item: { label: string; value: string }) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  ),
}));

jest.mock('@/common/context/useGlobalContext', () => ({
  useGlobalContext: () => ({
    activeNetwork: {
      mode: 'mainnet',
      url: 'https://api.hiro.so',
    },
  }),
}));

jest.mock('../../../utils/walletTransactions', () => ({
  callContract: jest.fn(),
}));

const mockedCallContract = jest.mocked(callContract);
const address = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

const publicFunction = {
  access: 'public',
  name: 'transfer-two-assets',
  args: [],
  outputs: { type: 'bool' },
} as ClarityAbiFunction;

describe('FunctionView post-condition submission', () => {
  beforeEach(() => {
    mockedCallContract.mockReset();
    mockedCallContract.mockResolvedValue({} as never);
  });

  it('passes every configured post condition to the wallet request', async () => {
    const user = userEvent.setup();
    const { getAllByLabelText, getByLabelText, getByRole } = renderWithProviders(
      <FunctionView
        fn={publicFunction}
        contractId={`${address}.example-contract`}
        cancelButton={<button type="button">Cancel</button>}
      />
    );

    await user.click(getByRole('button', { name: 'Add post-condition' }));
    await user.selectOptions(
      getByLabelText('Post-condition 1 type'),
      String(PostConditionType.STX)
    );
    await user.selectOptions(
      getByLabelText('Post-condition 1 condition code'),
      String(FungibleConditionCode.Equal)
    );
    await user.type(getAllByLabelText('Address')[0], address);
    await user.type(getAllByLabelText('Amount')[0], '100');

    await user.click(getByRole('button', { name: 'Add post-condition' }));
    await user.selectOptions(
      getByLabelText('Post-condition 2 type'),
      String(PostConditionType.Staking)
    );
    await user.selectOptions(
      getByLabelText('Post-condition 2 condition code'),
      String(FungibleConditionCode.LessEqual)
    );
    await user.type(getAllByLabelText('Address')[1], address);
    await user.type(getAllByLabelText('Amount')[1], '200');

    await user.click(getByRole('button', { name: 'Call function' }));

    await waitFor(() => {
      expect(mockedCallContract).toHaveBeenCalledWith({
        contract: `${address}.example-contract`,
        functionName: 'transfer-two-assets',
        functionArgs: [],
        network: 'mainnet',
        postConditionMode: 'deny',
        postConditions: [
          {
            type: 'stx-postcondition',
            address,
            condition: 'eq',
            amount: '100',
          },
          {
            type: 'staking-postcondition',
            address,
            condition: 'lte',
            amount: '200',
          },
        ],
      });
    });
  });

  it('keeps configured post conditions when using allow mode', async () => {
    const user = userEvent.setup();
    const { getAllByLabelText, getByLabelText, getByRole } = renderWithProviders(
      <FunctionView
        fn={publicFunction}
        contractId={`${address}.example-contract`}
        cancelButton={<button type="button">Cancel</button>}
      />
    );

    await user.selectOptions(getByLabelText('Post-condition mode'), 'allow');
    await user.click(getByRole('button', { name: 'Add post-condition' }));
    await user.selectOptions(
      getByLabelText('Post-condition 1 type'),
      String(PostConditionType.STX)
    );
    await user.selectOptions(
      getByLabelText('Post-condition 1 condition code'),
      String(FungibleConditionCode.Equal)
    );
    await user.type(getAllByLabelText('Address')[0], address);
    await user.type(getAllByLabelText('Amount')[0], '100');
    await user.click(getByRole('button', { name: 'Call function' }));

    await waitFor(() => {
      expect(mockedCallContract).toHaveBeenCalledWith(
        expect.objectContaining({
          postConditionMode: 'allow',
          postConditions: [
            {
              type: 'stx-postcondition',
              address,
              condition: 'eq',
              amount: '100',
            },
          ],
        })
      );
    });
  });
});
