import { getBanditState, saveBanditState } from './bandit';

function initializeMatrix(size: number): number[][] {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
  );
}

export function addInterestingAddress(userId: string, address: string) {
  const state = getBanditState();

  if (!state.users[userId]) {
    console.log(`user state not found, initializing`);
    state.users[userId] = {
      preferences: {
        interestingContracts: [],
        interestingAddresses: [],
      },
      linucb: {
        dimension: 7,
        alpha: 10.0,
        actions: {
          '0': { A: initializeMatrix(7), b: Array(7).fill(0) },
          '1': { A: initializeMatrix(7), b: Array(7).fill(0) },
        },
      },
    };
  }

  const user = state.users[userId].preferences;

  if (!user.interestingAddresses.includes(address)) {
    user.interestingAddresses.push(address);
    console.log(`added address ${address} to user ${userId}'s preferences.`);
    saveBanditState();
  }
}

export function addInterestingContract(userId: string, contractId: string) {
  const state = getBanditState();

  if (!state.users[userId]) {
    console.log(`user state not found, initializing`);
    state.users[userId] = {
      preferences: {
        interestingContracts: [],
        interestingAddresses: [],
      },
      linucb: {
        dimension: 7,
        alpha: 10.0,
        actions: {
          '0': { A: initializeMatrix(7), b: Array(7).fill(0) },
          '1': { A: initializeMatrix(7), b: Array(7).fill(0) },
        },
      },
    };
  }

  const user = state.users[userId].preferences;

  if (!user.interestingContracts.includes(contractId)) {
    user.interestingContracts.push(contractId);
    console.log(`added contract ${contractId} to user ${userId}'s preferences.`);
    saveBanditState();
  }
}
