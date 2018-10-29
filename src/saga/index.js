import {put,take,call,cancel,fork} from 'redux-saga/effects';
import {takeEvery,takeLastest,all,delay} from 'redux-saga';//高级API
import * as ActionType from '../action/actionType';
import {getMainPageData,uploadLoc,tongyinConvert,chat,getChatSessionId,EXCEPTION,getSamples} from '../services/api';
console.log("delay is "+delay);
//获取chatbot主页的应用列表
function* getMainPageDataAPI (payload){
	try{
	    const response=yield call(getMainPageData,payload.payload);
	    yield put({
	    	type:ActionType.DEAL_MAINPAGE_DATA,
	    	payload:{appList:response.data.appList,title:response.data.title},
	    })
      payload.callback && payload.callback(response.data);
	}catch(e){
        alert("exception in getMainPageDataAPI in saga/index is "+e);
	}
}

function* tongyinConvertAPI (payload){
	try{
       const response=yield call(tongyinConvert,payload);
       return response;
	}catch(e){
       alert("exception in saga/tongyinConvertAPI is "+e);
	}
}

function* getChatSessionIdAPI(payload){
	try{
       //setTimeout(function(){
         const response=yield call(getChatSessionId,payload.payload);
         yield put({
           type:ActionType.DEAL_SESSION_ID,
           payload:response.chatSessionID,
         })
       //},300)
	}catch(e){
      alert("exception in saga/getChatSessionIdAPI is "+e);
	}
}

function* chatAPI(payload){
    if('payload' in payload){
      payload=payload.payload;
    }
    try{
        const response=yield call(chat,payload);

        yield put({
        	type:ActionType.DEAL_CHAT,
        	payload:{
        		message:JSON.parse(response['message']),
        		kdIntention:JSON.parse(response['kdIntention']),
            text:'',
        		lastUnfinishedIntention:response['lastUnfinishedIntention'] && JSON.parse(response['lastUnfinishedIntention']),
        	},
        })
    }catch(e){
    	alert("exception in chatAPI/saga is "+e);
    }
}

function* getSamplesAPI(payload){
   try{
       const response=yield call(getSamples,payload.payload);
   }catch(e){
      alert("exception is getSamplesAPI/saga is "+e);
   }
}

//首次上报位置
function* uploadLocationAPI(payload){
   try{
        const response=yield call(uploadLoc,payload.payload);
        //alert("response is "+JSON.stringify(response));

   }catch(e){
      alert("exception in updateLocationAPI/saga is "+e);
   }
}

//获取意图的样本
function* getIntentionSample(payload){
   try{
      //console.log("getIntentionSample payload is "+JSON.stringify(payload));
      const response=yield call(getSamples,payload.payload);
      //console.log("response in getIntentionSample is "+JSON.stringify(response));
      if(response.result.result==1){
         let tempArr=[];
         const list=response.result.data;
         list.list.forEach(item=>tempArr.push(item.sentence));
         yield put({
           type:ActionType.DEAL_INTENTION_SAMPLES,
           payload:tempArr,
         })
      }

   }catch(e){
      alert("exception in getIntentionSample is "+e);
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
function* watchUpdateLocAPI(){
  yield takeEvery(ActionType.UPLOAD_LOC,uploadLocationAPI);
}
function* watchSayAPI(){
	while(true){
       try{
		   const payload=yield take(ActionType.SAY);
		   const sessionId=payload.payload.sessionId;
		   const response=yield call(tongyinConvertAPI,payload.payload);
       yield put({
          type:ActionType.DEAL_TONGYIN_CONVERT,
          payload:{
            text:response.text,
            kdIntention:null,
          }
       })
       //console.log("response is "+JSON.stringify(response));
        // if(response.text!='提交'){
           yield call(chatAPI,{sessionId,message:response.  text});
         //}
      }catch(e){
            alert("exception in watchSayAPI is "+e);
         }
	}
}

function* watchLocalID(){
  while(true){
    try{
      const payload=yield take(ActionType.LOCAL_ID);
      yield put({
         type:ActionType.SAVE_LOCAL_ID,
         payload:payload.payload.localId,
      })
    }catch(e){

    }
  }
}


function* watchSampleAPI(){
  yield takeEvery(ActionType.FETCH_INTENTION_SAMPLES,getIntentionSample);
}

export default function* rootSaga() {
   try{
	   yield fork(watchGetMainPageData);
	   yield fork(watchGetSessionID);
	  // yield fork(watchTongyinConvert);
	   yield fork(watchChatAPI);
	   yield fork(watchSayAPI);
     yield fork(watchUpdateLocAPI);
     yield fork(watchSampleAPI);
     //yield fork(watchLocalID);
   }catch(e){
      alert("exception in saga/rootSaga is "+e);
   }

}