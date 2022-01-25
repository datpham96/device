import {combineReducers} from 'redux';
import loginReducers from './loginReducers';
import userReducers from './userReducers';

export default combineReducers({
  auth: loginReducers,
  user: userReducers,
});
