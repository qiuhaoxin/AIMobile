import {getMainPageData,uploadLoc,tongyinConvert,chat,getChatSessionId} from '../services/api';
import * as ActionType from './actionType';
export const changeLoading=flag=>{
	return ({
		type:'changeLoading',
		showLoading:flag,
	})
}
//获取小K的配置信息
export const fetchMainPageData=(payload)=>{
	console.log("payload is "+JSON.stringify(payload));
    return async dispatch=>{
    	//
    //	dispatch(changeLoading(showLoading));
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

/*
上传定位信息
@Param  payload:{
    sessionId:会话id
    locStr:位置信息 目前只是传市
}
*/
export const uploadLocation=(payload)=>{
    console.log("payload in mainpage is "+JSON.stringify(payload));
   return async dispatch=>{
      try{
          const response=await uploadLoc(payload);
          dispatch({
            type:ActionType.UPLOAD_LOC,
            payload:response['data'],
          })
      }catch(e){

      }
   }
}

/*
* 同音词转换

*/
export const tongyinconvert=(payload)=>{
   return async dispatch=>{
      try{
        const response=await tongyinConvert(payload);

        dispatch({
          type:ActionType.TONG_YIN_CONVERT,
          payload:response['text'],
        })
      }catch(e){

      }
   }
}

export const getSessionId=(payload)=>{
    console.log("getSessionId payload is "+JSON.stringify(payload));
    return async dispatch=>{
      try{
        const response=await getChatSessionId(payload);
        console.log("response is "+JSON.stringify(response));

        dispatch({
          type:ActionType.FETCH_SESSION_ID,
          payload:response['chatSessionID'],
        })
      }catch(e){

      }
    }
}

/*
* 对话
  payload{
     sessionId:'',
     text:'',
  }
*/
export const chatDialog=(payload)=>{
   return async dispatch=>{
      try{
        const response=await chat(payload);
        dispatch({
          type:ActionType.CHAT,
          payload:JSON.parse(response['message']),
        })
      }catch(e){

      }
   }
}


