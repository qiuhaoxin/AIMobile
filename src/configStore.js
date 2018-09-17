import {createStore,applyMiddleware} from 'redux';
import reducers  from './reducers';
import createSagaMiddleware from 'redux-saga';
import RootSaga from './saga';
const sagaMiddleware=createSagaMiddleware(RootSaga);
const store=createStore(reducers,applyMiddleware(sagaMiddleware));


export default store;