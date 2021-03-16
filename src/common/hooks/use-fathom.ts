import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Fathom from 'fathom-client';
import { IS_BROWSER, IS_DEV } from '@common/constants';

const FATHOM_ID = 'YAKFSIOZ';
const FATHOM_DOMAIN = 'explorer.stacks.co';
const FATHOM_GOAL_AMOUNT = 100; // fathom uses cents as quantity, so 100 === $1

export enum Goals {
  SANDBOX_LOAD = 'SANDBOX_LOAD',
  SANDBOX_SIGNIN = 'SANDBOX_SIGNIN',
  SANDBOX_DEPLOY = 'SANDBOX_DEPLOY',
  SANDBOX_CONTRACT_CALL = 'SANDBOX_CONTRACT_CALL',
  SANDBOX_CONTRACT_SEARCH = 'SANDBOX_CONTRACT_SEARCH',
  SANDBOX_TOKEN_TRANSFER = 'SANDBOX_TOKEN_TRANSFER',
  SANDBOX_FAUCET = 'SANDBOX_FAUCET',
}

const GOALS: Record<keyof typeof Goals, string> = {
  SANDBOX_LOAD: 'WP2MRJWI',
  SANDBOX_SIGNIN: '91CKHJUT',
  SANDBOX_DEPLOY: '3YR9Q96D',
  SANDBOX_CONTRACT_CALL: 'R9LKQQ1G',
  SANDBOX_CONTRACT_SEARCH: 'VKMCZBXA',
  SANDBOX_TOKEN_TRANSFER: 'S3AOSGC4',
  SANDBOX_FAUCET: 'DLYVG2OQ',
};

type GoalKeys = keyof typeof Goals;

function loadFathom() {
  if (!IS_DEV && IS_BROWSER) {
    Fathom.load(FATHOM_ID, {
      includedDomains: [FATHOM_DOMAIN],
    });
  }
}

function onRouteChangeComplete() {
  Fathom.trackPageview();
}

export const useFathomGoal = () => {
  try {
    loadFathom();
  } catch (e) {
    console.error(e.message);
  }

  const handleTrackGoal = (goal: GoalKeys) => {
    try {
      Fathom.trackGoal(GOALS[goal], FATHOM_GOAL_AMOUNT);
    } catch (e) {}
  };

  return {
    handleTrackGoal,
  };
};

export const useFathom = () => {
  const router = useRouter();

  useEffect(() => {
    if (!IS_DEV && IS_BROWSER) {
      try {
        loadFathom();
      } catch (e) {
        console.error(e.message);
      }

      const handleRouteChange = () => onRouteChangeComplete();

      router.events.on('routeChangeComplete', handleRouteChange);

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, []);
};
