import {
  TxTableData,
  defaultColumnDefinitions,
} from '@/common/components/table/table-examples/TxsTable';
import { TxTableColumns } from '@/common/components/table/table-examples/types';
import { getAmount, getToAddress } from '@/common/utils/transaction-utils';
import { microToStacksFormatted, validateStacksContractId } from '@/common/utils/utils';
import { ArrowRight } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

export const getStorybookTxTableTanstackColumns = (
  hasSorting?: boolean,
  pinFirstColumn?: boolean
): ColumnDef<TxTableData>[] => {
  const columns = [...defaultColumnDefinitions];

  columns.forEach(column => {
    if (column.id === TxTableColumns.ArrowRight) {
      return;
    }
    column.enableSorting = hasSorting;
  });

  const transactionColumnIndex = columns.findIndex(
    column => column.id === TxTableColumns.Transaction
  );
  if (transactionColumnIndex !== -1) {
    columns[transactionColumnIndex] = {
      ...columns[transactionColumnIndex],
      enablePinning: pinFirstColumn,
      meta: {
        isPinned: pinFirstColumn ? 'left' : false,
      },
    };
  }

  return columns;
};

export const storybookTxTableData: Transaction[] = [
  {
    tx_id: '0xca85ac121953ead526a3ca4bad5dfe011dbe253ba1b76c63c0ba3e784a55d2b1',
    nonce: 3,
    fee_rate: '3000',
    sender_address: 'SPB4276WPN6DCP1F758M032583E2J4TCVP7ZQ2NX',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [],
    anchor_mode: 'any',
    block_hash: '0x7a2e707af7bc0def0955cad3978f998ddfb7119e520643ea6b9320c89d9c5249',
    block_height: 610719,
    block_time: 1739468184,
    block_time_iso: '2025-02-13T17:36:24.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 0,
    tx_status: 'success',
    tx_result: {
      hex: '0x070c0000000401610d0000000c6c6973742d696e2d757374780a636f6d6d697373696f6e06162bcf9762d5b90bc36dc1b4759b1727690f92ddd31367616d6d612d636f6d6d697373696f6e2d763102696401000000000000000000000000000170b805707269636501000000000000000000000005b4e5ed92',
      repr: '(ok (tuple (a "list-in-ustx") (commission \'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.gamma-commission-v1) (id u94392) (price u24509803922)))',
    },
    event_count: 1,
    parent_block_hash: '0xc611e155fe00c895cdf03b1c0d4e6ea30f027090a0948b600593ca96752be644',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 10,
    execution_cost_read_length: 93551,
    execution_cost_runtime: 139949,
    execution_cost_write_count: 1,
    execution_cost_write_length: 100,
    events: [],
    tx_type: 'contract_call',
    contract_call: {
      contract_id: 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2',
      function_name: 'list-in-ustx',
      function_signature:
        '(define-public (list-in-ustx (id uint) (price uint) (comm-trait trait_reference)))',
      function_args: [
        {
          hex: '0x01000000000000000000000000000170b8',
          repr: 'u94392',
          name: 'id',
          type: 'uint',
        },
        {
          hex: '0x01000000000000000000000005b4e5ed92',
          repr: 'u24509803922',
          name: 'price',
          type: 'uint',
        },
        {
          hex: '0x06162bcf9762d5b90bc36dc1b4759b1727690f92ddd31367616d6d612d636f6d6d697373696f6e2d7631',
          repr: "'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.gamma-commission-v1",
          name: 'comm-trait',
          type: 'trait_reference',
        },
      ],
    },
  },
  {
    tx_id: '0x2ef172b123b1872772c66250c936885e4621d0a7715ff67f44b051b0cd2e8802',
    nonce: 15667,
    fee_rate: '180',
    sender_address: 'SP3XXK8BG5X7CRH7W07RRJK3JZJXJ799WX3Y0SMCR',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [],
    anchor_mode: 'on_chain_only',
    block_hash: '0xc611e155fe00c895cdf03b1c0d4e6ea30f027090a0948b600593ca96752be644',
    block_height: 610718,
    block_time: 1739468171,
    block_time_iso: '2025-02-13T17:36:11.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 0,
    tx_status: 'abort_by_post_condition',
    tx_result: {
      hex: '0x0703',
      repr: '(ok true)',
    },
    event_count: 1,
    parent_block_hash: '0x4df730d2fdeb110ed322c404a5d6fc3d7d808540727d792fdc7783fed3f10a94',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 0,
    execution_cost_read_length: 0,
    execution_cost_runtime: 0,
    execution_cost_write_count: 0,
    execution_cost_write_length: 0,
    events: [],
    tx_type: 'token_transfer',
    token_transfer: {
      recipient_address: 'SP3SBQ9PZEMBNBAWTR7FRPE3XK0EFW9JWVX4G80S2',
      amount: '1',
      memo: '0x00000000000000000000000000000000000000000000000000000000000000000000',
    },
  },
  {
    tx_id: '0x18559cf285a7a74f38595b40c080f383a9cfb00df19b99743086f4c445346121',
    nonce: 14587,
    fee_rate: '3000',
    sender_address: 'SP3WMZH4GCH820YP3XHD6GX5TKQ411MHSKPJ9H22R',
    sponsored: false,
    post_condition_mode: 'allow',
    post_conditions: [],
    anchor_mode: 'on_chain_only',
    block_hash: '0x4df730d2fdeb110ed322c404a5d6fc3d7d808540727d792fdc7783fed3f10a94',
    block_height: 610717,
    block_time: 1739468158,
    block_time_iso: '2025-02-13T17:35:58.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 1,
    tx_status: 'success',
    tx_result: {
      hex: '0x0703',
      repr: '(ok true)',
    },
    event_count: 14,
    parent_block_hash: '0x99adee49f06fbc8836eeadc1e992ce29c5136eb255fd270b517065fed5dac642',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 950,
    execution_cost_read_length: 1170583,
    execution_cost_runtime: 3071015,
    execution_cost_write_count: 77,
    execution_cost_write_length: 160,
    events: [],
    tx_type: 'contract_call',
    contract_call: {
      contract_id: 'SPGYCP878RYFVT03ZT8TWGPKNYTSQB1578VVXHGE.powerful-farmer',
      function_name: 'execute-both',
      function_signature: '(define-public (execute-both ))',
      function_args: [],
    },
  },
  {
    tx_id: '0x1e8fe1e6f9a46ee0be9229d1b1cfde2293b5902c54f17cc9221dc3835cbdd180',
    nonce: 52,
    fee_rate: '298',
    sender_address: 'SP30YXRTQ4GJE64RDWY8K5ZN38C8W24PG6VP8B093',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [
      {
        principal: {
          type_id: 'principal_standard',
          address: 'SP30YXRTQ4GJE64RDWY8K5ZN38C8W24PG6VP8B093',
        },
        condition_code: 'sent_equal_to',
        amount: '19800000000',
        type: 'fungible',
        asset: {
          asset_name: 'usdh',
          contract_address: 'SPN5AKG35QZSK2M8GAMR4AFX45659RJHDW353HSG',
          contract_name: 'usdh-token-v1',
        },
      },
    ],
    anchor_mode: 'any',
    block_hash: '0x4df730d2fdeb110ed322c404a5d6fc3d7d808540727d792fdc7783fed3f10a94',
    block_height: 610717,
    block_time: 1739468158,
    block_time_iso: '2025-02-13T17:35:58.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 0,
    tx_status: 'success',
    tx_result: {
      hex: '0x0703',
      repr: '(ok true)',
    },
    event_count: 3,
    parent_block_hash: '0x99adee49f06fbc8836eeadc1e992ce29c5136eb255fd270b517065fed5dac642',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 7,
    execution_cost_read_length: 3707,
    execution_cost_runtime: 24458,
    execution_cost_write_count: 2,
    execution_cost_write_length: 1,
    events: [],
    tx_type: 'contract_call',
    contract_call: {
      contract_id: 'SPN5AKG35QZSK2M8GAMR4AFX45659RJHDW353HSG.usdh-token-v1',
      function_name: 'transfer',
      function_signature:
        '(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34)))))',
      function_args: [
        {
          hex: '0x010000000000000000000000049c2c0600',
          repr: 'u19800000000',
          name: 'amount',
          type: 'uint',
        },
        {
          hex: '0x0516c1eee3572424e3130de79132fea34311c112d036',
          repr: "'SP30YXRTQ4GJE64RDWY8K5ZN38C8W24PG6VP8B093",
          name: 'sender',
          type: 'principal',
        },
        {
          hex: '0x051679944056d24287a0ef2611636f2e8c386168839d',
          repr: "'SP1WS8G2PT918F87F4R8P6VSEHGW62T43KP6TPG6E",
          name: 'recipient',
          type: 'principal',
        },
        {
          hex: '0x09',
          repr: 'none',
          name: 'memo',
          type: '(optional (buff 34))',
        },
      ],
    },
  },
  {
    tx_id: '0x7fad61def135b8bab42014edafb1f5088b1f181e973d8c71ce89e1400213bd87',
    nonce: 15666,
    fee_rate: '180',
    sender_address: 'SP3SBQ9PZEMBNBAWTR7FRPE3XK0EFW9JWVX4G80S2',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [],
    anchor_mode: 'on_chain_only',
    block_hash: '0x99adee49f06fbc8836eeadc1e992ce29c5136eb255fd270b517065fed5dac642',
    block_height: 610716,
    block_time: 1739468144,
    block_time_iso: '2025-02-13T17:35:44.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 1,
    tx_status: 'success',
    tx_result: {
      hex: '0x0703',
      repr: '(ok true)',
    },
    event_count: 1,
    parent_block_hash: '0x46642e522c8d51442cedf117dc179557b41df3f4fab2fcd7c744a0311427c220',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 0,
    execution_cost_read_length: 0,
    execution_cost_runtime: 0,
    execution_cost_write_count: 0,
    execution_cost_write_length: 0,
    events: [],
    tx_type: 'token_transfer',
    token_transfer: {
      recipient_address: 'SP3XXK8BG5X7CRH7W07RRJK3JZJXJ799WX3Y0SMCR',
      amount: '1',
      memo: '0x00000000000000000000000000000000000000000000000000000000000000000000',
    },
  },
  {
    tx_id: '0x0aa379197ed2644992c9c60c994edd27cb9be1664d10827f7f7807676fe66f3f',
    nonce: 3,
    fee_rate: '3000',
    sender_address: 'SP1M88SZW4639PT8KEEYH882Q8X9J2P9FWKZPR3ZJ',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [],
    anchor_mode: 'any',
    block_hash: '0x99adee49f06fbc8836eeadc1e992ce29c5136eb255fd270b517065fed5dac642',
    block_height: 610716,
    block_time: 1739468144,
    block_time_iso: '2025-02-13T17:35:44.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 0,
    tx_status: 'success',
    tx_result: {
      hex: '0x070c0000000401610d0000000c6c6973742d696e2d757374780a636f6d6d697373696f6e06162bcf9762d5b90bc36dc1b4759b1727690f92ddd31367616d6d612d636f6d6d697373696f6e2d763102696401000000000000000000000000000312a3057072696365010000000000000000000000036c89f4f1',
      repr: '(ok (tuple (a "list-in-ustx") (commission \'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.gamma-commission-v1) (id u201379) (price u14705882353)))',
    },
    event_count: 1,
    parent_block_hash: '0x46642e522c8d51442cedf117dc179557b41df3f4fab2fcd7c744a0311427c220',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 10,
    execution_cost_read_length: 93535,
    execution_cost_runtime: 139933,
    execution_cost_write_count: 1,
    execution_cost_write_length: 100,
    events: [],
    tx_type: 'contract_call',
    contract_call: {
      contract_id: 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2',
      function_name: 'list-in-ustx',
      function_signature:
        '(define-public (list-in-ustx (id uint) (price uint) (comm-trait trait_reference)))',
      function_args: [
        {
          hex: '0x01000000000000000000000000000312a3',
          repr: 'u201379',
          name: 'id',
          type: 'uint',
        },
        {
          hex: '0x010000000000000000000000036c89f4f1',
          repr: 'u14705882353',
          name: 'price',
          type: 'uint',
        },
        {
          hex: '0x06162bcf9762d5b90bc36dc1b4759b1727690f92ddd31367616d6d612d636f6d6d697373696f6e2d7631',
          repr: "'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.gamma-commission-v1",
          name: 'comm-trait',
          type: 'trait_reference',
        },
      ],
    },
  },
  {
    tx_id: '0x2bb97a0ded0ebd513681456c979a286f134af5f57a56a0dbe75bf932f285f3af',
    nonce: 3,
    fee_rate: '392',
    sender_address: 'SPB44NKC554NHT2XT83B2DEA39M0F6003Q0EQPP9',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [
      {
        principal: {
          type_id: 'principal_standard',
          address: 'SPB44NKC554NHT2XT83B2DEA39M0F6003Q0EQPP9',
        },
        condition_code: 'sent_equal_to',
        amount: '132872487',
        type: 'fungible',
        asset: {
          asset_name: 'usdh',
          contract_address: 'SPN5AKG35QZSK2M8GAMR4AFX45659RJHDW353HSG',
          contract_name: 'usdh-token-v1',
        },
      },
    ],
    anchor_mode: 'any',
    block_hash: '0x46642e522c8d51442cedf117dc179557b41df3f4fab2fcd7c744a0311427c220',
    block_height: 610715,
    block_time: 1739468131,
    block_time_iso: '2025-02-13T17:35:31.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 1,
    tx_status: 'success',
    tx_result: {
      hex: '0x0703',
      repr: '(ok true)',
    },
    event_count: 11,
    parent_block_hash: '0x251e704db91090301c52d4702233dc079153d1661d9a8871684c92fd3f68921f',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 339,
    execution_cost_read_length: 1841130,
    execution_cost_runtime: 4207326,
    execution_cost_write_count: 11,
    execution_cost_write_length: 3250,
    events: [],
    tx_type: 'contract_call',
    contract_call: {
      contract_id: 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.borrow-helper-v2-0-0',
      function_name: 'supply',
      function_signature:
        '(define-public (supply (lp trait_reference) (pool-reserve principal) (asset trait_reference) (amount uint) (owner principal) (referral (optional principal))))',
      function_args: [
        {
          hex: '0x061605b65e5089ed1b09b299fe0d910a82e37570781f0a7a757364682d76322d30',
          repr: "'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.zusdh-v2-0",
          name: 'lp',
          type: 'trait_reference',
        },
        {
          hex: '0x061605b65e5089ed1b09b299fe0d910a82e37570781f13706f6f6c2d302d726573657276652d76322d30',
          repr: "'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-0-reserve-v2-0",
          name: 'pool-reserve',
          type: 'principal',
        },
        {
          hex: '0x06162a554e032dff998a8882a98229fd214c54e2516f0d757364682d746f6b656e2d7631',
          repr: "'SPN5AKG35QZSK2M8GAMR4AFX45659RJHDW353HSG.usdh-token-v1",
          name: 'asset',
          type: 'trait_reference',
        },
        {
          hex: '0x0100000000000000000000000007eb7927',
          repr: 'u132872487',
          name: 'amount',
          type: 'uint',
        },
        {
          hex: '0x05161642566c294958e85dd206b135ca1a680798001d',
          repr: "'SPB44NKC554NHT2XT83B2DEA39M0F6003Q0EQPP9",
          name: 'owner',
          type: 'principal',
        },
        {
          hex: '0x09',
          repr: 'none',
          name: 'referral',
          type: '(optional principal)',
        },
      ],
    },
  },
  {
    tx_id: '0xd9b2fcc3482bb481481db2a73263a734405a59a7529a0712d7bfee26730de739',
    nonce: 2,
    fee_rate: '390',
    sender_address: 'SPB44NKC554NHT2XT83B2DEA39M0F6003Q0EQPP9',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [
      {
        principal: {
          type_id: 'principal_standard',
          address: 'SPB44NKC554NHT2XT83B2DEA39M0F6003Q0EQPP9',
        },
        condition_code: 'sent_equal_to',
        amount: '1317142',
        type: 'fungible',
        asset: {
          asset_name: 'ststx',
          contract_address: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
          contract_name: 'ststx-token',
        },
      },
    ],
    anchor_mode: 'any',
    block_hash: '0x46642e522c8d51442cedf117dc179557b41df3f4fab2fcd7c744a0311427c220',
    block_height: 610715,
    block_time: 1739468131,
    block_time_iso: '2025-02-13T17:35:31.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 0,
    tx_status: 'success',
    tx_result: {
      hex: '0x0703',
      repr: '(ok true)',
    },
    event_count: 12,
    parent_block_hash: '0x251e704db91090301c52d4702233dc079153d1661d9a8871684c92fd3f68921f',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 343,
    execution_cost_read_length: 1904259,
    execution_cost_runtime: 3853212,
    execution_cost_write_count: 12,
    execution_cost_write_length: 3502,
    events: [],
    tx_type: 'contract_call',
    contract_call: {
      contract_id: 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.borrow-helper-v2-0-0',
      function_name: 'supply',
      function_signature:
        '(define-public (supply (lp trait_reference) (pool-reserve principal) (asset trait_reference) (amount uint) (owner principal) (referral (optional principal))))',
      function_args: [
        {
          hex: '0x061605b65e5089ed1b09b299fe0d910a82e37570781f0b7a73747374782d76322d30',
          repr: "'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.zststx-v2-0",
          name: 'lp',
          type: 'trait_reference',
        },
        {
          hex: '0x061605b65e5089ed1b09b299fe0d910a82e37570781f13706f6f6c2d302d726573657276652d76322d30',
          repr: "'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-0-reserve-v2-0",
          name: 'pool-reserve',
          type: 'principal',
        },
        {
          hex: '0x0616099fb88926d82f30b2f40eaf3ee423cb725bdb3b0b73747374782d746f6b656e',
          repr: "'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token",
          name: 'asset',
          type: 'trait_reference',
        },
        {
          hex: '0x0100000000000000000000000000141916',
          repr: 'u1317142',
          name: 'amount',
          type: 'uint',
        },
        {
          hex: '0x05161642566c294958e85dd206b135ca1a680798001d',
          repr: "'SPB44NKC554NHT2XT83B2DEA39M0F6003Q0EQPP9",
          name: 'owner',
          type: 'principal',
        },
        {
          hex: '0x09',
          repr: 'none',
          name: 'referral',
          type: '(optional principal)',
        },
      ],
    },
  },
  {
    tx_id: '0xbcb0dc4b7e469db1aca59533cd0d9805f833ab94c47fcdb50d67724989ad3f51',
    nonce: 15666,
    fee_rate: '180',
    sender_address: 'SP3XXK8BG5X7CRH7W07RRJK3JZJXJ799WX3Y0SMCR',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [],
    anchor_mode: 'on_chain_only',
    block_hash: '0x251e704db91090301c52d4702233dc079153d1661d9a8871684c92fd3f68921f',
    block_height: 610714,
    block_time: 1739468117,
    block_time_iso: '2025-02-13T17:35:17.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 2,
    tx_status: 'success',
    tx_result: {
      hex: '0x0703',
      repr: '(ok true)',
    },
    event_count: 1,
    parent_block_hash: '0x0a96613d86641e42aed09389317c32effe284be0c583944a74fb308ef988e2c0',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 0,
    execution_cost_read_length: 0,
    execution_cost_runtime: 0,
    execution_cost_write_count: 0,
    execution_cost_write_length: 0,
    events: [],
    tx_type: 'token_transfer',
    token_transfer: {
      recipient_address: 'SP3SBQ9PZEMBNBAWTR7FRPE3XK0EFW9JWVX4G80S2',
      amount: '1',
      memo: '0x00000000000000000000000000000000000000000000000000000000000000000000',
    },
  },
  {
    tx_id: '0x802e5b748f361e322eb6d39b7cd2f70414eafd74b3c6dc72c02f684b1a0e891e',
    nonce: 118,
    fee_rate: '3000',
    sender_address: 'SPRTGGX3PRNP6MVCHX3P486JZHCFXZRQ8YS5QJ7K',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [
      {
        principal: {
          type_id: 'principal_standard',
          address: 'SPRTGGX3PRNP6MVCHX3P486JZHCFXZRQ8YS5QJ7K',
        },
        condition_code: 'sent_equal_to',
        amount: '331524852',
        type: 'fungible',
        asset: {
          asset_name: 'alex',
          contract_address: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM',
          contract_name: 'token-alex',
        },
      },
      {
        principal: {
          type_id: 'principal_standard',
          address: 'SPRTGGX3PRNP6MVCHX3P486JZHCFXZRQ8YS5QJ7K',
        },
        condition_code: 'sent_greater_than_or_equal_to',
        amount: '0',
        type: 'fungible',
        asset: {
          asset_name: 'auto-alex-v3',
          contract_address: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM',
          contract_name: 'auto-alex-v3',
        },
      },
      {
        principal: {
          type_id: 'principal_contract',
          address: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM',
          contract_name: 'amm-vault-v2-01',
        },
        condition_code: 'sent_greater_than_or_equal_to',
        amount: '0',
        type: 'fungible',
        asset: {
          asset_name: 'amm-pool-v2-01-token',
          contract_address: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM',
          contract_name: 'token-amm-pool-v2-01',
        },
      },
    ],
    anchor_mode: 'any',
    block_hash: '0x251e704db91090301c52d4702233dc079153d1661d9a8871684c92fd3f68921f',
    block_height: 610714,
    block_time: 1739468117,
    block_time_iso: '2025-02-13T17:35:17.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 1,
    tx_status: 'success',
    tx_result: {
      hex: '0x070c000000030264780100000000000000000000000013c2aaf402647901000000000000000000000000144ef1c606737570706c790100000000000000000000000024f41033',
      repr: '(ok (tuple (dx u331524852) (dy u340718022) (supply u619974707)))',
    },
    event_count: 6,
    parent_block_hash: '0x0a96613d86641e42aed09389317c32effe284be0c583944a74fb308ef988e2c0',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 57,
    execution_cost_read_length: 111108,
    execution_cost_runtime: 334340,
    execution_cost_write_count: 9,
    execution_cost_write_length: 734,
    events: [],
    tx_type: 'contract_call',
    contract_call: {
      contract_id: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.amm-pool-v2-01',
      function_name: 'add-to-position',
      function_signature:
        '(define-public (add-to-position (token-x-trait trait_reference) (token-y-trait trait_reference) (factor uint) (dx uint) (max-dy (optional uint))))',
      function_args: [
        {
          hex: '0x0616402da2c079e5d31d58b9cfc7286d1b1eb2f7834e0a746f6b656e2d616c6578',
          repr: "'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex",
          name: 'token-x-trait',
          type: 'trait_reference',
        },
        {
          hex: '0x0616402da2c079e5d31d58b9cfc7286d1b1eb2f7834e0d746f6b656e2d776c69616c6578',
          repr: "'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wlialex",
          name: 'token-y-trait',
          type: 'trait_reference',
        },
        {
          hex: '0x01000000000000000000000000004c4b40',
          repr: 'u5000000',
          name: 'factor',
          type: 'uint',
        },
        {
          hex: '0x0100000000000000000000000013c2aaf4',
          repr: 'u331524852',
          name: 'dx',
          type: 'uint',
        },
        {
          hex: '0x0a01000000000000000000000000151ee6f7',
          repr: '(some u354346743)',
          name: 'max-dy',
          type: '(optional uint)',
        },
      ],
    },
  },
  {
    tx_id: '0xd8be31eea82c8b078e497d8c8dee0b7228a6f8903731489dbdc6d705454b8833',
    nonce: 36,
    fee_rate: '73126',
    sender_address: 'SP2XGT4XMKGB6DBN6FGZAVAXHBQT18F3G3WJ4TTTW',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [
      {
        principal: {
          type_id: 'principal_standard',
          address: 'SP2XGT4XMKGB6DBN6FGZAVAXHBQT18F3G3WJ4TTTW',
        },
        condition_code: 'sent_equal_to',
        amount: '5000000',
        type: 'stx',
      },
      {
        principal: {
          type_id: 'principal_contract',
          address: 'SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M',
          contract_name: 'stableswap-stx-ststx-v-1-2',
        },
        condition_code: 'sent_greater_than_or_equal_to',
        amount: '4513661',
        type: 'fungible',
        asset: {
          asset_name: 'ststx',
          contract_address: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
          contract_name: 'ststx-token',
        },
      },
    ],
    anchor_mode: 'any',
    block_hash: '0x11349a78968baf37a5f992be6ac055a427e5b00e19d39a48dd9ce2fb27330bf2',
    block_height: 610707,
    block_time: 1739468016,
    block_time_iso: '2025-02-13T17:33:36.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 2,
    tx_status: 'success',
    tx_result: {
      hex: '0x07010000000000000000000000000047c753',
      repr: '(ok u4704083)',
    },
    event_count: 4,
    parent_block_hash: '0x69ad2a04f07ddce42f74952921e55a5f547bd9a01ae0b22474e600510c105295',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 1174,
    execution_cost_read_length: 84355,
    execution_cost_runtime: 21056218,
    execution_cost_write_count: 5,
    execution_cost_write_length: 498,
    events: [],
    tx_type: 'contract_call',
    contract_call: {
      contract_id: 'SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M.stableswap-stx-ststx-v-1-2',
      function_name: 'swap-x-for-y',
      function_signature:
        '(define-public (swap-x-for-y (y-token trait_reference) (lp-token trait_reference) (x-amount uint) (min-y-amount uint)))',
      function_args: [
        {
          hex: '0x0616099fb88926d82f30b2f40eaf3ee423cb725bdb3b0b73747374782d746f6b656e',
          repr: "'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token",
          name: 'y-token',
          type: 'trait_reference',
        },
        {
          hex: '0x06162ec1a2dc2904ebc8b408598116c75e42c51afa26187374782d73747374782d6c702d746f6b656e2d762d312d32',
          repr: "'SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M.stx-ststx-lp-token-v-1-2",
          name: 'lp-token',
          type: 'trait_reference',
        },
        {
          hex: '0x01000000000000000000000000004c4b40',
          repr: 'u5000000',
          name: 'x-amount',
          type: 'uint',
        },
        {
          hex: '0x010000000000000000000000000044df7d',
          repr: 'u4513661',
          name: 'min-y-amount',
          type: 'uint',
        },
      ],
    },
  },
  {
    tx_id: '0x2976079f70e7d7332927dd887cdc1e137051dce32959074da5c9c37efd0a5074',
    nonce: 3,
    fee_rate: '3000',
    sender_address: 'SP3446XZWYD3YAYC029K6S7DFR11NPTHE5R96PBY0',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [],
    anchor_mode: 'any',
    block_hash: '0x11349a78968baf37a5f992be6ac055a427e5b00e19d39a48dd9ce2fb27330bf2',
    block_height: 610707,
    block_time: 1739468016,
    block_time_iso: '2025-02-13T17:33:36.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 1,
    tx_status: 'success',
    tx_result: {
      hex: '0x070c0000000401610d0000000c6c6973742d696e2d757374780a636f6d6d697373696f6e06162bcf9762d5b90bc36dc1b4759b1727690f92ddd31367616d6d612d636f6d6d697373696f6e2d76310269640100000000000000000000000000011a06057072696365010000000000000000000000223d63916a',
      repr: '(ok (tuple (a "list-in-ustx") (commission \'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.gamma-commission-v1) (id u72198) (price u147058823530)))',
    },
    event_count: 1,
    parent_block_hash: '0x69ad2a04f07ddce42f74952921e55a5f547bd9a01ae0b22474e600510c105295',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 10,
    execution_cost_read_length: 93543,
    execution_cost_runtime: 139941,
    execution_cost_write_count: 1,
    execution_cost_write_length: 100,
    events: [],
    tx_type: 'contract_call',
    contract_call: {
      contract_id: 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2',
      function_name: 'list-in-ustx',
      function_signature:
        '(define-public (list-in-ustx (id uint) (price uint) (comm-trait trait_reference)))',
      function_args: [
        {
          hex: '0x0100000000000000000000000000011a06',
          repr: 'u72198',
          name: 'id',
          type: 'uint',
        },
        {
          hex: '0x010000000000000000000000223d63916a',
          repr: 'u147058823530',
          name: 'price',
          type: 'uint',
        },
        {
          hex: '0x06162bcf9762d5b90bc36dc1b4759b1727690f92ddd31367616d6d612d636f6d6d697373696f6e2d7631',
          repr: "'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.gamma-commission-v1",
          name: 'comm-trait',
          type: 'trait_reference',
        },
      ],
    },
  },
  {
    tx_id: '0x47b3a37dd9d72077a23b8d8305a1182701f10cd57e32a39d41d5fbf74ad8be18',
    nonce: 8965,
    fee_rate: '0',
    sender_address: 'SP2GFTC849NTM5ZC1PVBFHG3MMFYHR5RMYS4TEJGH',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [],
    anchor_mode: 'on_chain_only',
    block_hash: '0x11349a78968baf37a5f992be6ac055a427e5b00e19d39a48dd9ce2fb27330bf2',
    block_height: 610707,
    block_time: 1739468016,
    block_time_iso: '2025-02-13T17:33:36.000Z',
    burn_block_time: 1739467681,
    burn_block_height: 883606,
    burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    parent_burn_block_time: 1739467681,
    parent_burn_block_time_iso: '2025-02-13T17:28:01.000Z',
    canonical: true,
    tx_index: 0,
    tx_status: 'success',
    tx_result: {
      hex: '0x0703',
      repr: '(ok true)',
    },
    event_count: 0,
    parent_block_hash: '0x69ad2a04f07ddce42f74952921e55a5f547bd9a01ae0b22474e600510c105295',
    is_unanchored: false,
    microblock_hash: '0x',
    microblock_sequence: 2147483647,
    microblock_canonical: true,
    execution_cost_read_count: 0,
    execution_cost_read_length: 0,
    execution_cost_runtime: 0,
    execution_cost_write_count: 0,
    execution_cost_write_length: 0,
    events: [],
    tx_type: 'tenure_change',
    tenure_change_payload: {
      tenure_consensus_hash: '0xa6c8700648204f7fcd73ca6eba13270bae14be5a',
      prev_tenure_consensus_hash: '0xa6c8700648204f7fcd73ca6eba13270bae14be5a',
      burn_view_consensus_hash: '0xa6c8700648204f7fcd73ca6eba13270bae14be5a',
      previous_tenure_end: '0x90e95168d928d41ea73efe9c211daddf438776f19cddc924656dd527c7ecf22b',
      previous_tenure_blocks: 17,
      cause: 'extended',
      pubkey_hash: '0xa0fd31044d7542fd81b6d6f8c074a3fd1c1714f6',
    },
  },
];

export const storybookTxTableRowData: TxTableData[] = storybookTxTableData.map(tx => {
  const to = getToAddress(tx);
  const amount = getAmount(tx);
  return {
    [TxTableColumns.Transaction]: {
      amount: microToStacksFormatted(amount),
      functionName: tx.tx_type === 'contract_call' ? tx.contract_call?.function_name : undefined,
      contractName: tx.tx_type === 'contract_call' ? tx.contract_call?.contract_id : undefined,
      txType: tx.tx_type,
      status: tx.tx_status,
      txId: tx.tx_id,
      blockHeight: tx.block_height,
      smartContract: {
        contractId: tx.tx_type === 'smart_contract' ? tx.smart_contract?.contract_id : undefined,
      },
      tenureChangePayload: {
        cause: tx.tx_type === 'tenure_change' ? tx.tenure_change_payload?.cause : undefined,
      },
    },
    [TxTableColumns.TxId]: tx.tx_id,
    [TxTableColumns.TxType]: tx.tx_type,
    [TxTableColumns.From]: {
      address: tx.sender_address,
      isContract: validateStacksContractId(tx.sender_address),
    },
    [TxTableColumns.ArrowRight]: <ArrowRight />,
    [TxTableColumns.To]: {
      address: to,
      isContract: validateStacksContractId(to),
    },
    [TxTableColumns.Fee]: tx.fee_rate,
    [TxTableColumns.Amount]: amount,
    [TxTableColumns.BlockTime]: tx.block_time,
  };
});
