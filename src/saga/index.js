import {put,take,call,cancel,fork} from 'redux-saga/effects';
import {takeEvery,takeLastest,all} from 'redux-saga';//高级API
import * as ActionType from '../action/actionType';
import {getMainPageData,uploadLoc,tongyinConvert,chat,getChatSessionId,EXCEPTION} from '../services/api';

//获取chatbot主页的应用列表
function* getMainPageDataAPI (payload){
	try{
	    const response=yield call(getMainPageData,payload.payload);
	    yield put({
	    	type:ActionType.DEAL_MAINPAGE_DATA,
	    	payload:{appList:response.data.appList,title:response.data.title},
	    })
	}catch(e){
        console.log("exception in getMainPageDataAPI in saga/index is "+e);
	}
}

function* tongyinConvertAPI (payload){
   // console.log("tongyinConvertAPI payload is "+JSON.stringify(payload));
	try{
       const response=yield call(tongyinConvert,payload);
       //console.log("response in tongyinConvert is "+JSON.stringify(response));
       // yield put({
       //    type:ActionType.DEAL_TONGYIN_CONVERT,
       //    payload:response.text,
       // })
       return response;
	}catch(e){

	}
}

function* getChatSessionIdAPI(payload){
	console.log("getChatSessionId is "+JSON.stringify(payload));
	try{
       const response=yield call(getChatSessionId,payload.payload);
       console.log("response is "+JSON.stringify(response));
       yield put({
       	 type:ActionType.DEAL_SESSION_ID,
       	 payload:response.chatSessionID,
       })
	}catch(e){

	}
}

function* chatAPI(payload){
    try{
        const response=yield call(chat,payload);
        console.log("chatAPI response is "+JSON.stringify(response));
        yield put({
        	type:ActionType.DEAL_CHAT,
        	payload:{
        		message:JSON.parse(response['message']),
        		kdIntention:JSON.parse(response['kdIntention']),
        		text:payload.message,
        		lastUnfinishedIntention:response['lastUnfinishedIntention'] && JSON.parse(response['lastUnfinishedIntention']),
        	},
        })
    }catch(e){
    	console.log("exception in chatAPI/saga is "+e);
    }
}

function* watchGetMainPageData(){
	yield takeEvery(ActionType.FETCH_MAINPAGE_DATA,getMainPageDataAPI);
}
function* watchTongyinConvert(){
	yield takeEvery(ActionType.TONG_YIN_CONVERT,tongyinConvertAPI);
}
function* watchGetSessionID(){
	yield takeEvery(ActionType.FETCH_SESSION_ID,getChatSessionIdAPI)
}
function* watchChatAPI(){
	yield takeEvery(ActionType.CHAT,chatAPI);
}
function* watchSayAPI(){
	while(true){
       try{
		   const payload=yield take(ActionType.SAY);
		   const sessionId=payload.payload.sessionId;
		   const response=yield call(tongyinConvertAPI,payload.payload);
		   yield call(chatAPI,{sessionId,message:response.text});
       }catch(e){

       }
	}
}

export default function* rootSaga() {
   try{
	   yield fork(watchGetMainPageData);
	   yield fork(watchGetSessionID);
	  // yield fork(watchTongyinConvert);
	  // yield fork(watchChatAPI);
	   yield fork(watchSayAPI);
   }catch(e){
      console.log("exception in saga/rootSaga is "+e);
   }

}