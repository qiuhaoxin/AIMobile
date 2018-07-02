import * as ActionType from '../action/actionType';
console.log("actionofsdfsd type is "+ActionType.FETCH_SESSION_ID);
let initState={
   title:'小K,您好',
   appList:[],
   sessionId:"-99",
   message:{},//对话返回结果
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
            }
        break;
        case ActionType.CHAT:
            return {
              ...state,
              message:action.payload,
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