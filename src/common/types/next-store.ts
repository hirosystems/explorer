import { Store } from 'redux';
import { NextPageContext } from 'next';
import { ThunkDispatch } from 'redux-thunk';

interface AppStore extends Store {
  dispatch: ThunkDispatch<any, any, any>;
}

export interface ReduxNextPageContext extends NextPageContext {
  store: AppStore;
}
