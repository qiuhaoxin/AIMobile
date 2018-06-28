import {getMainPageData,uploadLoc,tongyinConvert} from '../services/api';
import * as ActionType from './actionType';
export const changeLoading=flag=>{
	return ({
		type:'changeLoading',
		showLoading:flag,
	})
}
//获取小K的配置信息
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

/*
上传定位信息
@Param  payload:{
    sessionId:会话id
    locStr:位置信息 目前只是传市
}
*/
export const uploadLocation=(loc,payload)=>{
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
export const tongyinconvert=(text)=>{
   return async dispatch=>{
      try{
        const response=await tongyinConvert(payload)
      }catch(e){

      }
   }
}


