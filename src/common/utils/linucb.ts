import * as math from 'mathjs';

import { getBanditState, saveBanditState } from './bandit';

function initializeMatrix(size: number): number[][] {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
  );
}

function initLinUCBForUser(userId: string, dimension = 7, alpha = 1.0) {
  const state = getBanditState();
  if (!state.users[userId]) {
    state.users[userId] = {
      preferences: {
        interestingContracts: [],
        interestingAddresses: [],
      },
      linucb: {
        dimension,
        alpha,
        actions: {
          '0': { A: initializeMatrix(dimension), b: Array(dimension).fill(0) },
          '1': { A: initializeMatrix(dimension), b: Array(dimension).fill(0) },
        },
      },
    };
    saveBanditState();
    console.log(`🔧 Initialized LinUCB for user: ${userId}`);
  }
}

export function linucbChooseAction(userId: string, context: number[]): number {
  const state = getBanditState();
  initLinUCBForUser(userId, context.length);

  const userLinUCB = state.users[userId].linucb;
  const { alpha, actions } = userLinUCB;

  let bestAction = 0;
  let bestUCB = -Infinity;

  for (const actionStr in actions) {
    const action = parseInt(actionStr);
    const A = math.matrix(actions[actionStr].A);
    const b = math.matrix(actions[actionStr].b);

    let A_inv;
    try {
      // Add regularization to prevent singularity
      const regularizedA = math.add(A, math.diag(Array(userLinUCB.dimension).fill(1e-5)));
      A_inv = math.inv(regularizedA);
    } catch (error) {
      console.error('Matrix inversion failed, using pseudo-inverse:', error);
      A_inv = math.pinv(A);
    }

    const theta = math.multiply(A_inv, b) as math.Matrix;
    const x = math.matrix(context);

    const exploit = math.dot(theta, x) as number;
    const explore = alpha * Math.sqrt(math.dot(x, math.multiply(A_inv, x)) as number);
    const ucb = exploit + explore;

    if (ucb > bestUCB) {
      bestUCB = ucb;
      bestAction = action;
    }
  }

  console.log(`🕹️ Chose action ${bestAction} for user ${userId} with UCB ${bestUCB.toFixed(2)}`);
  return bestAction;
}

export function linucbUpdate(userId: string, action: number, context: number[], reward: number) {
  const state = getBanditState();
  const userLinUCB = state.users[userId].linucb;
  const actionStr = action.toString();

  const A = math.matrix(userLinUCB.actions[actionStr].A);
  const b = math.matrix(userLinUCB.actions[actionStr].b);
  const x = math.matrix(context);

  // Update A: A = A + x * x^T
  const outerXX = math.multiply(
    math.reshape(x, [x.size()[0], 1]),
    math.reshape(x, [1, x.size()[0]])
  );
  const A_new = math.add(A, outerXX);

  // Add regularization to A_new
  const regularizedA = math.add(A_new, math.diag(Array(userLinUCB.dimension).fill(1e-5)));

  // Update b: b = b + reward * x
  const b_new = math.add(b, math.multiply(x, reward));

  // Store updated A and b
  userLinUCB.actions[actionStr].A = regularizedA.toArray();
  userLinUCB.actions[actionStr].b = b_new.toArray();

  saveBanditState();
  console.log(`🔄 Updated LinUCB for user ${userId}, action ${action}, reward ${reward}`);
}
