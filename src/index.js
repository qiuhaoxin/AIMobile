import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import Router from './routes';
import reducers  from './reducers';
import thunk from 'redux-thunk';


const store=createStore(reducers,applyMiddleware(thunk));
console.log("store is "+JSON.stringify(store.getState()));
function render(MyCompnent){
	return ReactDOM.render(
		<Provider store={store}>
           <MyCompnent />
		</Provider>,
		document.getElementById('root')
	)
}
render(Router);