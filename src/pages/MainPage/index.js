import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import className from 'classnames';
import Styles from './index.less';
import {RecommendCard} from 'aicomponents';
import {connect} from 'react-redux';
import * as ActionType from '../../action/actionType';
// import {fetchMainPageData,uploadLocation,chatDialog,tongyinconvert,getSessionId} from '../../action/mainpage';
import {isYZJ,getNetWorkType,getLocation,speak,getYZJLang,getOS,backYZJ,playVoice,stopPlayVoice,startSpeech,stopSpeech} from '../../utils/yzj';
import {isEmpty,FilterMaxId,saveInLocalStorage,getInLocalStorage,delInLocalStorage,getValueFromUrl} from '../../utils/utils';
import Footer from '../../components/Footer';
import AppTips from '../../components/AppTips';
import DialogList from '../../components/DialogList';
// import {uploadLog} from '../../services/api';
// import {FETCH_SESSION_ID} from  '../../action/actionType/';
//  import Dialog from '../../components/Dialog'; 
// import Tip from '../../components/Tip';
// import Select from '../../components/Selects';
// import SiriWave from '../../lib/SiriWave';
// import LinkSelect from '../../components/LinkSelect';

import xiaok from '../../images/xiaok.png';

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
const TIME_TO_HIDE=150;
class MainPage extends Component{
    constructor(props){
      super(props);
      this.data=[
           {id:1,ftitle:'人人差旅',ftips:'我明天要去北京出差',ficonpath:chailubiaozhun},
           {id:2,ftitle:'智能核算',ftips:'我要核算',ficonpath:chuchashenqing},
           {id:3,ftitle:'日志管理',ftips:'我要日志管理',ficonpath:chuchashenqing},
           {id:4,ftitle:'业务流服务',ftips:'我要查看业务流程',ficonpath:xiechengshanglu},
      ]
    }
    state={
       canSayArr:[],
       appTipsVisible:false,
       dialog:null,
       showDialogList:false,
    }
    componentWillReceiveProps(nextProps){
        console.log("nextProps text is "+nextProps.text);
        if(nextProps.text){
           this.setState({
              dialog:nextProps.text,
              showDialogList:true,
           })
        }
    }
    componentDidMount(){
      const {dispatch}=this.props;
      this.getSessionIdFirst();
         //有会话记录就恢复记录，没有请求主页数据
      const result= getValueFromUrl(!isEmpty(location.search) ? location.search : location.href,['appid','openId']);
      dispatch({type:ActionType.FETCH_MAINPAGE_DATA,payload:{appid:result && result['appid'] || ''}});
    }
    getSessionIdFirst=()=>{
       const {dispatch}=this.props;
       //alert("sessionId is Localstorage is "+getInLocalStorage('sessionId')+" and window chatSessionId is "+window.chatSessionId);
       const sessionId=getInLocalStorage('sessionId') || window.chatSessionId || '';
       if(sessionId){
         // dispatch({
         //    type:FETCH_SESSION_ID,
         //    payload:sessionId,
         // })
       }else{
        const result= getValueFromUrl(!isEmpty(location.search) ? location.search : location.href,['appid','openId','uname']);
        //getChatSessionIdAPI({appid:result['appid'],openId:result['openId'],uname:result['uname']})
        dispatch({
          type:ActionType.FETCH_SESSION_ID,
          payload:{appid:result['appid'],openId:result['openId'],uname:result['uname']}
        })
       }

    }
    handleChangeApp=()=>{
      console.log("handleChangeApp!");
    }
    handleItemClick=(item)=>{
       this.hideMainPage();
       this.setState({
          appTipsVisible:true,
       })
    }
    //处理Footer的文字/语音输入
    handleInput=(value)=>{
       const {dispatch,sessionId}=this.props;
       //dispatch({type:ActionType.TONG_YIN_CONVERT,payload:{text:value,sessionId}});
       dispatch({type:ActionType.SAY,payload:{text:value,sessionId}});
       //隐藏首页APPList
       if(this.state.appTipsVisible){
          this.hideAppTips();
       }else{
          this.hideMainPage();
       }
    }
    hideMainPage=()=>{
        const _this=this;
        if(this.ContentTip){
           const height=this.ContentTip.scrollHeight;
           this.ContentTip.style['transform']=`translate(0,${- height - 30 }px)`;
           this.ContentTip.style['transition']='transform .1s ease-in-out';
           setTimeout(function(){
              _this.ContentTip.style['display']="none";
           },TIME_TO_HIDE)
        }
    }
    hideAppTips=()=>{
      const _this=this;
      if(this.AppTip){
        const height=this.AppTip.scrollHeight;
        this.AppTip.style['transform']=`translate(0,${- height - 30 }px)`;
        this.AppTip.style['transition']='transform .1s ease-in-out';
        setTimeout(function(){
              _this.AppTip.style['display']="none";
        },TIME_TO_HIDE)
      }
    }
    render(){
      const {title,appList,sessionId,dispatch}=this.props;
      const {appTipsVisible}=this.state;
      return (
         <div className={Styles.wrapper}>
            <div className={Styles.header} ref={el=>this.Header=el}>
              <div className={Styles.contentTip} ref={el=>this.ContentTip=el}>
                 <div className={Styles.rowTitle}>
                    {title}
                 </div>
                 <RecommendCard data={appList} desc={RECOMMENDCARD_DESC} className={Styles['recommend-demo']} 
                     onBtnClick={this.handleChangeApp} onItemClick={this.handleItemClick}>
                 </RecommendCard>
              </div>
            </div>
            <div ref={el=>this.AppTip=el}>
               <AppTips visible={appTipsVisible}></AppTips>
            </div>
            <div>
                <DialogList visible={this.state.showDialogList} sessionId={sessionId} dispatch={dispatch}>
                </DialogList>
            </div>
            <Footer sessionId={sessionId} dispatch={this.props.dispatch} onEnterClick={this.handleInput}></Footer>
         </div>
      )
    }
}


export default connect(state=>{
  return {
     title:state.mainpage.title,
     appList:state.mainpage.appList,
     sessionId:state.mainpage.sessionId,
     text:state.mainpage.text,
  }
})(MainPage);
