import {getMainPageData} from '../services/api';
import * as ActionType from './actionType';
export const changeLoading=flag=>{
	return ({
		type:'changeLoading',
		showLoading:flag,
	})
}
export const fetchMainPageData=(showLoading,payload)=>{
	console.log("payload is "+JSON.stringify(payload));
    return async dispatch=>{
    	//
    	dispatch(changeLoading(showLoading));
    	try{
            const response=await getMainPageData(payload);
            dispatch({
            	type:ActionType.FETCH_MAINPAGE_DATA,
            	payload:response['data'],
            })
    	}catch(e){

    	}
    }
}


