import React,{Component} from 'react';
import {HashRouter,Route,Switch,Redirect} from 'react-router-dom';

import MainPage from '../pages/MainPage';

class Router extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
	        <HashRouter>
	            <Switch>
	                <Route path="/mainpage" component={MainPage} />
	                <Redirect to="/mainpage"/>
	            </Switch>
	        </HashRouter>
		)
	}
}
export default Router;
/*
*appid/:uname/:openId
*/