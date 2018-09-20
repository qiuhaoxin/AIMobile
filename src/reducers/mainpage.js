import * as ActionType from '../action/actionType';

let initState={
   title:'小K,您好',
   appList:[],
   sessionId:"-99",
   message:null,//对话返回结果
   kdIntention:null,//会话当前的 意图及词槽
   lastUnfinishedIntention:null,
   text:'',//同音转换结果
   dialog:'',//用户输入
   exception:'',//异常
}

const mainpage=(state=initState,action)=>{
     switch(action.type){
        case ActionType.DEAL_MAINPAGE_DATA:
            console.log("action payload is "+JSON.stringify(action.payload));
            let data=action.payload;
            data.appList.forEach(item=>{
              if(item.ficonpath && item.ficonpath.indexOf('static/Icon')==-1){
                 item.ficonpath='http://172.20.70.42:8888/rest/static/Icon/'+item.ficonpath;
              }
            })
            return {
            	...state,
              ...data,
            }
        break;

        case ActionType.DEAL_TONGYIN_CONVERT:
            console.log("DEAL_TONGYIN_CONVERT is "+action.payload);
            return {
              ...state,
              text:action.payload,
              message:null,//置为null，避免主页在同音词转换和请求chat接口直接循环请求
            }
        break;
        case ActionType.DEAL_CHAT:
            //console.log("action deal chat is "+JSON.stringify(action.payload));
            return {
              ...state,
              ...action.payload,
              //text:'',//置为空，避免主页在同音词转换和请求chat接口直接循环请求
            }
        break;
        case ActionType.DEAL_SESSION_ID:
           console.log("pay is "+JSON.stringify(action.payload));
           return {
              ...state,
              sessionId:action.payload,
           }
        break;
        case ActionType.SAY:
           //console.log("payload in say reducer is "+JSON.stringify(action.payload));
           return {
              ...state,
              kdIntention:null,
              ...action.payload,
           }
        break;
        case ActionType.EXCEPTION://异常处理
           console.log("exc is "+action);
           return {
              ...state,
              exception:action.payload,
              text:'',
           }
        break;
        default:
            return state;
        break;
     }
}

export default mainpage;