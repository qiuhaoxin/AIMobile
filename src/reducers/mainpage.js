import * as ActionType from '../action/actionType';
import {FilterMaxId} from '../utils/utils';
import cloneDeep from 'lodash/cloneDeep';
let initState={
   title:'小K,您好',
   appList:[],
   sessionId:"-99",
   //message:null,//对话返回结果
  // kdIntention:null,//会话当前的 意图及词槽
   //lastUnfinishedIntention:null,
   //text:'',//同音转换结果
   dialog:'',//用户输入
   exception:'',//异常
   appMessage:[],//意图样本
   //status:'clarify',//意图的状态  clarify:正在进行  satisfy:已完成
   localId:-1,//  语音播报的id
   startRecord:false,
   dialogList:[],
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
            const dialogList=state.dialogList;
            console.log("dialogList is "+JSON.stringify(dialogList));
            let tempList2=cloneDeep(dialogList);
            const id=FilterMaxId(dialogList,'id');
            tempList2.push({text:action.payload.text,id,className:'user-dialog'});
            console.log("action.payload.text is "+action.payload.text);
            if(action.payload.text=='提交'){
              let tempObj=tempList2.slice(tempList2.length - 2,tempList2.length - 1);
              const listId=FilterMaxId(tempList2,'id');
              tempObj=cloneDeep(tempObj && tempObj[0]);
              console.log("tempObj is "+JSON.stringify(tempObj)+" and listid is "+listId);
              tempObj.id=listId;
              tempObj.message.text="小K正在为您提交单据，请稍后...";
              console.log("tempObj is "+JSON.stringify(tempObj));
              tempList2.push(tempObj);
            }
            console.log("tempList2  is "+JSON.stringify(tempList2));
            //console.log("action.payload.text is "+action.payload.text);
            return {
              ...state,
              ...action.payload,
              dialogList:tempList2,
              //message:null,//置为null，避免主页在同音词转换和请求chat接口直接循环请求
            }
        break;
        case ActionType.DEAL_CHAT:
            const {kdIntention,message}=action.payload;
            const tempList=state.dialogList;
            let tempList3=cloneDeep(tempList);
            const maxId=FilterMaxId(tempList,'id');
            console.log("maxId is "+maxId);
            let temp={id:maxId,className:'chatbot-dialog'};
            temp={
              ...temp,
              ...action.payload,
            }
            tempList3.forEach(item=>{
              if(item.className=='chatbot-dialog' && item.message 
                && item.message.type=='TEXT' && item.kdIntention && item.kdIntention.status!='' && item.kdIntention.intention==kdIntention.intention){
                   item.showBody=false;
              }
            })
            tempList3.push(temp)
            return {
              ...state,
              ...action.payload,
              dialogList:tempList3,
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