import 'babel-polyfill';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
//import createSagaMiddleware from 'redux-saga';
import {Provider} from 'react-redux';
//import {createStore,applyMiddleware} from 'redux';
import Router from './routes';
import reducers  from './reducers';
//import RootSaga from './saga';
//const sagaMiddleware=createSagaMiddleware(RootSaga);
//const store=createStore(reducers,applyMiddleware(sagaMiddleware));
//sagaMiddleware.run(RootSaga);
import store from './configStore';
import fastclick from 'fastclick';

fastclick.attach(document.body);

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