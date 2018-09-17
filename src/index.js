import 'babel-polyfill';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
//import {createStore,applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import Router from './routes';
import reducers  from './reducers';
//import thunk from 'redux-thunk';
import RootSaga from './saga';

const sagaMiddleware=createSagaMiddleware(RootSaga);
const store=createStore(reducers,applyMiddleware(sagaMiddleware));
//sagaMiddleware.run(RootSaga);


function render(MyCompnent){
	return ReactDOM.render(
        <Provider store={store}>
           <Router />
        </Provider>,
		document.getElementById('root')
	)
}
render(Router);


if(module.hot){
	module.hot.accept(()=>{
		render('./routes');
	})
}
/*
		<Provider store={store}>
           <MyCompnent />
		</Provider>,
*/