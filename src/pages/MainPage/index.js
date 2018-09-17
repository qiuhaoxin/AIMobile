import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import className from 'classnames';
import Styles from './index.less';
import {RecommendCard} from 'aicomponents';
// import {connect} from 'react-redux';
// import {fetchMainPageData,uploadLocation,chatDialog,tongyinconvert,getSessionId} from '../../action/mainpage';
// import {isYZJ,getNetWorkType,getLocation,speak,getYZJLang,getOS,backYZJ,playVoice,stopPlayVoice,startSpeech,stopSpeech} from '../../utils/yzj';
// import {isEmpty,FilterMaxId,saveInLocalStorage,getInLocalStorage,delInLocalStorage,getValueFromUrl} from '../../utils/utils';

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
    render(){
      return (
         <div className={Styles.wrapper}>
             <RecommendCard data={this.data} className={Styles['recommend-demo']}></RecommendCard>
         </div>
      )
    }
}


export default MainPage;
