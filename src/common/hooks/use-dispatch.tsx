import { useDispatch as useReduxDispatch } from 'react-redux';
import { AppDispatch } from '@store';

// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
export const useDispatch = () => useReduxDispatch<AppDispatch>();
