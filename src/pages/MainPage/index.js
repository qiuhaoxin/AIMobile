import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import className from 'classnames';
import Styles from './index.less';
import {RecommendCard,BackIcon} from 'aicomponents';
import {connect} from 'react-redux';
import * as ActionType from '../../action/actionType';
import {isYZJ,getNetWorkType,getLocation,speak,getYZJLang,getOS,backYZJ,playVoice,stopPlayVoice,startSpeech,stopSpeech} from '../../utils/yzj';
import {isEmpty,FilterMaxId,saveInLocalStorage,getInLocalStorage,delInLocalStorage,getValueFromUrl} from '../../utils/utils';
import Footer from '../../components/Footer';
import AppTips from '../../components/AppTips';
import DialogList from '../../components/DialogList';
import xiaok from '../../images/xiaok.png';
import Iscroll from '../../components/Iscroll';

import chailubiaozhun from '../../images/chailubiaozhun.png';
import chuchashenqing from '../../images/chuchashenqing.png';
import xiechengshanglu from '../../images/xiechengshanglu.png';
const RECOMMENDCARD_DESC="请问有什么可以帮到您?";
const TIME_TO_HIDE=150;
class MainPage extends Component{
    constructor(props){
      super(props);
      //应用推荐Pagination 
      this.RAPagination={
         pageSize:4,
         current:1,
         total:0,
      }
    }
    state={
       canSayArr:[],
       appTipsVisible:false,
       appTitle:'',
       dialog:null,
       showDialogList:false,
       showRecommend:true,
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.text){
           this.setState({
              dialog:nextProps.text,
              showDialogList:true,
           })
        }
    }
    componentDidMount(){
      const {dispatch}=this.props;
      const dialogList=getInLocalStorage('dialog');
      const sessionId=getInLocalStorage('sessionId');
      const result=this.sceneSource();
      const _this=this;
      if(dialogList){
          if(sessionId){
            dispatch({
               type:ActionType.DEAL_SESSION_ID,
               payload:sessionId,
            })
          }
          this.setState({
             showDialogList:true,
          },()=>{
             delInLocalStorage('dialog');
             delInLocalStorage('sessionId')
          })
      }else{
          this.getSessionIdFirst();
          if(result){
             this.showAppTipDirect(result,dialogList);
          }else{
            //获取推荐卡片的推荐应用
            this.fetchMainPageData();
          }
          if(isYZJ()){
            getLocation((result)=>this.uploadLocation(result));
          }
      }
    }
    showAppTipDirect=(result,dialogList)=>{
        const {dispatch}=this.props;
        if(result=='BUS_TRIP'){
            dispatch({
               type:ActionType.FETCH_INTENTION_SAMPLES,
               payload:{
                  systemID:0,
                  intentionID:0,
                  intentionName:result,
               }
            }) 
        }
        this.setState({
           showRecommend:false,
           appTipsVisible:dialogList ? false : true,
        })
    }
    fetchMainPageData=()=>{
        const _this=this;
        const {dispatch}=this.props;
        //有会话记录就恢复记录，没有请求主页数据
        const result= getValueFromUrl(!isEmpty(location.search) ? location.search : location.href,['appid','openId']);
        dispatch({type:ActionType.FETCH_MAINPAGE_DATA,payload:{appid:result && result['appid'] || '',pagination:this.RAPagination},
            callback:function(response){
               const pagination=response['pagination'];
               if(pagination.current * pagination.pageSize < pagination.total){
                 _this.RAPagination={
                    ..._this.pagination,
                    ...pagination,
                    current:(pagination.current + 1)
                 }
               }
        }});
    }
    //判断页面的入口来源 urlParams:{scene:next}从下一代的应用进来
    sceneSource=()=>{
       const result= getValueFromUrl(!isEmpty(location.search) ? location.search : location.href,'scene');
       return result['scene'];
    }
    uploadLocation=(result)=>{
       const {uploadLocAPI,sessionId,dispatch}=this.props;
       if(result && String(result['success'])=='true'){
          const loc=result['data']['city'];
         dispatch({
           type:ActionType.UPLOAD_LOC,
           payload:{
              sessionId,
              locStr:loc
           }
         })
       }
    }
    getSessionIdFirst=()=>{
       const {dispatch}=this.props;
       const sessionId=getInLocalStorage('sessionId') || window.chatSessionId || '';
       if(sessionId){
          dispatch({
             type:ActionType.DEAL_SESSION_ID,
             payload:sessionId,
          })
       }else{
        const result= getValueFromUrl(!isEmpty(location.search) ? location.search : location.href,['appid','openId','uname']);
        dispatch({
          type:ActionType.FETCH_SESSION_ID,
          payload:{appid:result['appid'],openId:result['openId'],uname:result['uname']}
        })
       }

    }
    handleChangeApp=()=>{
        this.fetchMainPageData();
    }
    handleItemClick=(item)=>{
      console.log("item is "+JSON.stringify(item));
       const {dispatch}=this.props;
       dispatch({
          type:ActionType.FETCH_INTENTION_SAMPLES,
          payload:{
             systemID:item.fbizSysId,
             intentionID:item.fintentionId,
          }
       })
       this.hideMainPage();
       this.setState({
          appTipsVisible:true,
          appTitle:item.ftitle,
       })
    }
    //处理Footer的文字/语音输入
    handleInput=(value)=>{
       const {dispatch,sessionId}=this.props;
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
    handleIconClick=(e)=>{
       const _this=this;
       this.setState({
         showRecommend:true,
         appTipsVisible:false,
         showDialogList:false,
       },()=>{
          if(this.ContentTip){
             this.ContentTip.style['display']='block';
             this.ContentTip.style['transform']=`translate(0,0)`;
          }
       })
    }
    render(){
      const {title,appList,sessionId,dispatch,appMessage}=this.props;
      const {appTipsVisible,showDialogList,showRecommend,appTitle}=this.state;
      //console.log("appMessage is "+JSON.stringify(appMessage));
      return (
         <div className={Styles.wrapper}>
            <div className={Styles.header} ref={el=>this.Header=el}>
              <div className={Styles.contentTip} ref={el=>this.ContentTip=el} style={{display:!showDialogList ? 'block' : 'none'}}>
                 <div className={Styles.rowTitle}>
                    {title}
                 </div>
                 <RecommendCard style={{display:showRecommend ? 'block' : 'none'}} data={appList} desc={RECOMMENDCARD_DESC} className={Styles['recommend-demo']} 
                     onBtnClick={this.handleChangeApp} onItemClick={this.handleItemClick}>
                 </RecommendCard>
              </div>

              <div ref={el=>this.AppTip=el}>
                 <AppTips visible={appTipsVisible} appTips={appMessage} appTitle={appTitle}></AppTips>
              </div>

              <div>
                  <DialogList visible={showDialogList} sessionId={sessionId} dispatch={dispatch}>
                  </DialogList>
              </div>
            </div>
            <Footer sessionId={sessionId} dispatch={this.props.dispatch} onEnterClick={this.handleInput}></Footer>
            <BackIcon visible={showDialogList || appTipsVisible} onIconClick={this.handleIconClick}/>
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
     appMessage:state.mainpage.appMessage,
     status:state.mainpage.status,
  }
})(MainPage);



/*
                  <Iscroll>
                      <ul>
                          <li>tets</li>
                      </ul>
                  </Iscroll>







*/
