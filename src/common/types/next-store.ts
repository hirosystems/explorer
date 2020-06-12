import { Store } from 'redux';
import { NextPageContext } from 'next';
import { AppDispatch } from '@store';

interface AppStore extends Store {
  dispatch: AppDispatch;
}

export interface ReduxNextPageContext extends NextPageContext {
  store: AppStore;
}
