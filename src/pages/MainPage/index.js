import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import className from 'classnames';
import Styles from './index.less';
import {RecommendCard} from 'aicomponents';
import {connect} from 'react-redux';
import * as ActionType from '../../action/actionType';
// import {fetchMainPageData,uploadLocation,chatDialog,tongyinconvert,getSessionId} from '../../action/mainpage';
// import {isYZJ,getNetWorkType,getLocation,speak,getYZJLang,getOS,backYZJ,playVoice,stopPlayVoice,startSpeech,stopSpeech} from '../../utils/yzj';
import {isEmpty,FilterMaxId,saveInLocalStorage,getInLocalStorage,delInLocalStorage,getValueFromUrl} from '../../utils/utils';

// import {uploadLog} from '../../services/api';
// import {FETCH_SESSION_ID} from  '../../action/actionType/';
//  import Dialog from '../../components/Dialog'; 
// import Tip from '../../components/Tip';
// import Select from '../../components/Selects';
// import SiriWave from '../../lib/SiriWave';
// import LinkSelect from '../../components/LinkSelect';

// import xiaok from '../../images/xiaok.png';

//import {Dialog} from 'aicomponents'

// const HELP_TITLE='请问需要什么帮助？';
// const HELP_TITLE_TWO='你可以这样问我';
// const DIALOG_TITLE="这里是标题";
// const TIME_TO_SCROLL=150;
// const TIME_TO_HIDE=150;
// const SOURCE_ADDRESS="出发地",TARGET_ADDRESS='目的地',BEGIN_TIME="出发时间",BACK_TIME='返回时间';
// const urlMapping={
//   'BUS_TRIP':'renderExtendBus_tip'
// }

// let talk=startSpeech;
// let stopTalk=stopSpeech;
// let isSupportYZJApi=true;

import chailubiaozhun from '../../images/chailubiaozhun.png';
import chuchashenqing from '../../images/chuchashenqing.png';
import xiechengshanglu from '../../images/xiechengshanglu.png';
const RECOMMENDCARD_DESC="请问有什么可以帮到您?";
class MainPage extends Component{
    constructor(props){
      super(props);
      this.data=[
           {id:1,name:'人人差旅',desc:'我明天要去北京出差',imagePath:chailubiaozhun},
           {id:2,name:'智能核算',desc:'我要核算',imagePath:chuchashenqing},
           {id:3,name:'日志管理',desc:'我要日志管理',imagePath:chuchashenqing},
           {id:4,name:'业务流服务',desc:'我要查看业务流程',imagePath:xiechengshanglu},
      ]
    }
    componentDidMount(){
      const {dispatch}=this.props;
         //有会话记录就恢复记录，没有请求主页数据
      const result= getValueFromUrl(!isEmpty(location.search) ? location.search : location.href,['appid','openId']);
      //getMainPageData(true,{appid:result && result['appid'] || ''});
      dispatch({type:ActionType.FETCH_MAINPAGE_DATA,payload:{appid:result && result['appid'] || ''}});
    }
    handleChangeApp=()=>{
      console.log("handleChangeApp!");
    }
    handleItemClick=(item)=>{
      console.log("item is "+JSON.stringify(item))
    }
    render(){
      const {title}=this.props;
      return (
         <div className={Styles.wrapper}>
             <div className={Styles.rowTitle}>
                {title}
             </div>
             <RecommendCard data={this.data} desc={RECOMMENDCARD_DESC} className={Styles['recommend-demo']} 
             onBtnClick={this.handleChangeApp} onItemClick={this.handleItemClick}>
             </RecommendCard>
         </div>
      )
    }
}


export default connect(state=>{
  return {
     title:state.mainpage.title,
  }
})(MainPage);
