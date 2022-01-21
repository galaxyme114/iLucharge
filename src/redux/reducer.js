import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import auth from './reducers/AuthReducer';
import custom from './reducers/CustomReducer';

export default combineReducers({
  auth,
  custom,
});
