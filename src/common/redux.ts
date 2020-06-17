import { AppDispatch, RootState } from '@store';

export interface ThunkApiConfig {
  dispatch: AppDispatch;
  state: RootState;
  rejectValue?: {
    name: string;
    message: string;
  };
}
