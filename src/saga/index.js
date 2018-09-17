import {put,take,call,cancel,fork} from 'redux-saga/effects';
import {takeEvery,takeLastest} from 'redux-saga';//高级API
import * as ActionType from '../action/actionType';
import {getMainPageData,uploadLoc,tongyinConvert,chat,getChatSessionId,EXCEPTION} from '../services/api';

function* getMainPageDataAPI (payload){
	try{
	    const response=yield call(getMainPageData,payload.payload);
	    console.log("response is "+JSON.stringify(response));
	    yield put({
	    	type:ActionType.DEAL_MAINPAGE_DATA,
	    	payload:response.data,
	    })
	}catch(e){

	}
}
export default function* rootSaga() {
   // yield takeEvery(test);
   console.log("in rootSaga");
   yield takeEvery(ActionType.FETCH_MAINPAGE_DATA,getMainPageDataAPI);
   //yield fork(getMainPageDataAPI);
   try{

   }catch(e){
      console.log("exceptin is "+e);
   }

}