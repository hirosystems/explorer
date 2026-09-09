import { FungibleConditionCode, PostConditionType, PoxConditionCode } from '@stacks/transactions';

import {
  PostConditionParameters,
  checkPostConditionParameters,
  checkPostConditions,
  getPostCondition,
  getPostConditions,
} from '../PostConditionForm';

const address = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

const validFungiblePostCondition: PostConditionParameters = {
  postConditionType: PostConditionType.Fungible,
  postConditionConditionCode: FungibleConditionCode.Equal,
  postConditionAddress: address,
  postConditionAmount: '12345',
  postConditionAssetAddress: address,
  postConditionAssetContractName: 'asset-contract-name',
  postConditionAssetName: 'asset-name',
};

describe('checkPostConditionParameters', () => {
  it('requires a type for every added post condition', () => {
    expect(checkPostConditionParameters({})).toEqual({
      postConditionType: 'Post-condition type is required',
    });
  });

  it('returns no errors when all values are valid', () => {
    expect(checkPostConditionParameters(validFungiblePostCondition)).toEqual({});
  });

  it('accepts uint128 amounts as strings without losing precision', () => {
    expect(
      checkPostConditionParameters({
        ...validFungiblePostCondition,
        postConditionAmount: '340282366920938463463374607431768211455',
      })
    ).toEqual({});
  });

  it('returns an error when the condition code is missing', () => {
    expect(
      checkPostConditionParameters({
        ...validFungiblePostCondition,
        postConditionConditionCode: undefined,
      })
    ).toEqual({
      postConditionConditionCode: 'Condition Code is required',
    });
  });

  it('returns an error for an invalid Stacks address', () => {
    expect(
      checkPostConditionParameters({
        ...validFungiblePostCondition,
        postConditionAddress: 'INVALID_ADDRESS',
      })
    ).toEqual({
      postConditionAddress: 'Invalid Stacks address',
    });
  });

  it.each(['-1', '1.5', '340282366920938463463374607431768211456'])(
    'returns an error for invalid amount %s',
    postConditionAmount => {
      expect(
        checkPostConditionParameters({
          ...validFungiblePostCondition,
          postConditionAmount,
        })
      ).toEqual({ postConditionAmount: 'Invalid amount' });
    }
  );

  it('returns every field error for one post condition', () => {
    expect(
      checkPostConditionParameters({
        ...validFungiblePostCondition,
        postConditionAddress: 'INVALID_ADDRESS',
        postConditionAmount: '-1',
        postConditionAssetContractName: undefined,
      })
    ).toEqual({
      postConditionAmount: 'Invalid amount',
      postConditionAddress: 'Invalid Stacks address',
      postConditionAssetContractName: 'Asset Contract Name is required',
    });
  });

  it('keeps validation errors aligned with their post-condition index', () => {
    expect(checkPostConditions([validFungiblePostCondition, {}])).toEqual([
      {},
      { postConditionType: 'Post-condition type is required' },
    ]);
  });
});

describe('post-condition builders', () => {
  it('builds the pox-5 staking and pox post conditions', () => {
    expect(
      getPostCondition({
        postConditionType: PostConditionType.Staking,
        postConditionAddress: address,
        postConditionConditionCode: FungibleConditionCode.LessEqual,
        postConditionAmount: '1100000',
      })
    ).toEqual([{ type: 'staking-postcondition', address, condition: 'lte', amount: '1100000' }]);

    expect(
      getPostCondition({
        postConditionType: PostConditionType.PoX,
        postConditionAddress: address,
        postConditionConditionCode: PoxConditionCode.WillPerform,
      })
    ).toEqual([{ type: 'pox-postcondition', address, condition: 'will-perform' }]);
  });

  it('builds multiple post conditions in form order', () => {
    expect(
      getPostConditions([
        {
          postConditionType: PostConditionType.STX,
          postConditionAddress: address,
          postConditionConditionCode: FungibleConditionCode.LessEqual,
          postConditionAmount: '340282366920938463463374607431768211455',
        },
        {
          postConditionType: PostConditionType.PoX,
          postConditionAddress: address,
          postConditionConditionCode: PoxConditionCode.WillPerform,
        },
      ])
    ).toEqual([
      {
        type: 'stx-postcondition',
        address,
        condition: 'lte',
        amount: '340282366920938463463374607431768211455',
      },
      { type: 'pox-postcondition', address, condition: 'will-perform' },
    ]);
  });

  it('returns an empty list rather than [undefined] when nothing matches', () => {
    expect(
      getPostCondition({
        postConditionType: PostConditionType.PoX,
        postConditionAddress: address,
        postConditionConditionCode: FungibleConditionCode.Equal,
      })
    ).toEqual([]);
  });
});
