import { Store } from 'redux';
import { NextPageContext } from 'next';

export interface ReduxNextPageContext extends NextPageContext {
  store: Store;
}
