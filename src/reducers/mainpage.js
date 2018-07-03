import * as ActionType from '../action/actionType';
let initState={
   title:'小K,您好',
   appList:[],
   sessionId:"-99",
   message:{},//对话返回结果
   kdIntention:{},
   text:'',//同音转换结果
}

const mainpage=(state=initState,action)=>{
     switch(action.type){
        case ActionType.FETCH_MAINPAGE_DATA:
            return {
            	...state,
                ...action.payload,
            }
        break;
        case ActionType.TONG_YIN_CONVERT:
            return {
              ...state,
              text:action.payload,
              message:null,//置为null，避免主页在同音词转换和请求chat接口直接循环请求
            }
        break;
        case ActionType.CHAT:
            return {
              ...state,
              ...action.payload,
              text:'',//置为空，避免主页在同音词转换和请求chat接口直接循环请求
            }
        break;
        case ActionType.FETCH_SESSION_ID:
           return {
              ...state,
              sessionId:action.payload,
           }
        break;
        default:
            return state;
        break;
     }
}

export default mainpage;