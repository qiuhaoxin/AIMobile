import * as ActionType from '../action/actionType';
console.log("actiono type is "+ActionType.FETCH_MAINPAGE_DATA);
let initState={
   title:'小K,您好',
   appList:[],
   sessionId:"-99",
}

const mainpage=(state=initState,action)=>{
     switch(action.type){
        case ActionType.FETCH_MAINPAGE_DATA:
            return {
            	...state,
                ...action.payload,
            }
        break;
        default:
            return state;
        break;
     }
}

export default mainpage;