import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import appReducer from './reducers';
import rootSaga from './sagas';
import * as types from './constants';

const rootReducer = (state, action) => {
  if (action.type === types.LOGOUT.SUCCESS) {
    state = undefined;
  }

  return appReducer(state, action);
};
const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default {store};
