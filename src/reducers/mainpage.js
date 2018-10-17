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
   appMessage:[],//意图样本
   //status:'clarify',//意图的状态  clarify:正在进行  satisfy:已完成
   localId:-1,//  语音播报的id
   startRecord:false,
}

const mainpage=(state=initState,action)=>{
     switch(action.type){
        case ActionType.DEAL_MAINPAGE_DATA:
            //console.log("action payload is "+JSON.stringify(action.payload));
            let data=action.payload;
            data.appList.forEach(item=>{
                 item.ficonpath='http://172.20.70.42:8888/rest/static/Icon/9/gongzuoliu.png';
            })
            return {
            	...state,
              ...data,
            }
        break;

        case ActionType.DEAL_TONGYIN_CONVERT:
            //console.log("DEAL_TONGYIN_CONVERT is "+JSON.stringify(action.payload));
            return {
              ...state,
              ...action.payload,
              //message:null,//置为null，避免主页在同音词转换和请求chat接口直接循环请求
            }
        break;
        case ActionType.DEAL_CHAT:
            return {
              ...state,
              ...action.payload,
              //text:'',//置为空，避免主页在同音词转换和请求chat接口直接循环请求
            }
        break;
        case ActionType.DEAL_SESSION_ID:
           //console.log("pay is "+JSON.stringify(action.payload));
           return {
              ...state,
              sessionId:action.payload,
           }
        break;
        case ActionType.SAY:
           //console.log("say in reducers "+JSON.stringify(action));
           return {
              ...state,
              // kdIntention:null,
              // ...action.payload,
           }
        break;
        case ActionType.EXCEPTION://异常处理
           return {
              ...state,
              exception:action.payload,
              text:'',
           }
        break;
        case ActionType.DEAL_INTENTION_SAMPLES:
           return {
              ...state,
              appMessage:action.payload,
           }
        break;
        case ActionType.LOCAL_ID://保存播报语音的
            return {
                ...state,
                localId:action.payload.localId,
            }
        break;
        case ActionType.START_RECORD://开始录音
            return {
                ...state,
                startRecord:action.payload.startRecord,
            }
        break;
        default:
            return state;
        break;
     }
}

export default mainpage;