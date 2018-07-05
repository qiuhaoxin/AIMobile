import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import className from 'classnames';
import Styles from './index.less';
import {connect} from 'react-redux';
import {fetchMainPageData,uploadLocation,chatDialog,tongyinconvert,getSessionId} from '../../action/mainpage';
import {isYZJ,getNetWorkType,getLocation,speak,getYZJLang,getOS,backYZJ,playVoice,stopPlayVoice} from '../../utils/yzj';
import {isEmpty,FilterMaxId,saveInLocalStorage,getInLocalStorage,delInLocalStorage,getValueFromUrl} from '../../utils/utils';
import {FETCH_SESSION_ID} from  '../../action/actionType/';
import Dialog from '../../components/Dialog'; 
import Tip from '../../components/Tip';
import Select from '../../components/Selects';

import robotMic from '../../images/robot_mic.png';
import logo from '../../images/logo.gif';

const HELP_TITLE='请问需要什么帮助？';
const HELP_TITLE_TWO='你可以这样问我';
const DIALOG_TITLE="这里是标题";
const SOURCE_ADDRESS="出发地",TARGET_ADDRESS='目的地',BEGIN_TIME="出发时间",BACK_TIME='返回时间';

class MainPage extends Component{
  	constructor(props){
  		super(props);
      this.tipContent="";
  	}
    state={
      dialogList:[],
      showTip:false,//控制顶部Tip可见性
    }
    componentWillMount(){
       if(isYZJ()){
        backYZJ(function(){
           delInLocalStorage('dialog');
           delInLocalStorage('sessionId');
        })
       }
    }
    componentWillReceiveProps(nextProps){
      //console.log("nextProps is "+JSON.stringify(nextProps));
      if(!isEmpty(nextProps.exception) && nextProps.exception!=null){
          alert(nextProps.exception);
         //console.log("exception in mainpage is "+nextProps.exception);
      }
      //接收消息
      if(nextProps.message!=null){
         // alert("nextProps is "+JSON.stringify(nextProps));
          this.acceptMessage(nextProps);
          //this.transformDialog();
      }
      //同音转换发送消息
      if(!isEmpty(nextProps.text)){
          //alert("text is "+nextProps.text);
          this.sendMessage(nextProps.text);
      }
      if(!isEmpty(nextProps.sessionId) && nextProps.sessionId!=this.props.sessionId && nextProps.sessionId!='-99'){
          if(isYZJ()){
             getLocation((result)=>this.uploadLocation(nextProps.sessionId,result));
             //this.uploadLocation(nextProps.sessionId,{success:'true',data:{city:'深圳市'}})
          }
      }
    }
    componentDidMount(){
       // alert("sessionid is "+window.chatSessionId);
        const {getMainPageData,uploadLocAPI}=this.props;

        this.getSessionIdFirst();
        const result=getInLocalStorage('dialog');
        //console.log("result is "+JSON.stringify(result));
        if(result){
           this.hideMainPage();
           //if(!isYZJ()){
            //在浏览器非云之家中刷新一次就清除
            delInLocalStorage('dialog');
            delInLocalStorage('sessionId');
           //}
           this.setState({
              dialogList:result,
           })
        }else{
          //有会话记录就恢复记录，没有请求主页数据
          const result= getValueFromUrl(!isEmpty(location.search) ? location.search : location.href,['appid','openId']);
          getMainPageData(true,{appid:(result && result['appid']) || ''});
        }
    }
    componentWillUnmount(){
        delInLocalStorage('dialog');
        delInLocalStorage('sessionId');
    }
    getSessionIdFirst=()=>{
       const {getChatSessionIdAPI,dispatch}=this.props;
       const sessionId=getInLocalStorage('sessionId') || window.chatSessionId || '';
       if(sessionId){
         dispatch({
            type:FETCH_SESSION_ID,
            payload:sessionId,
         })
       }else{
         //const {appid,openId,uname}=this.props.match.params;
         const uname='邱浩新';
         const appid='500045674';
         const openId='5ad04e76e4b05c4b7d6245ba';
         getChatSessionIdAPI({appid,openId,uname})
       }

    }
    uploadLocation=(sessionId,result)=>{
       const {uploadLocAPI}=this.props;
       if(result && String(result['success'])=='true'){
          const loc=result['data']['city'];
          //alert("sessionId uploadLoc is "+sessionId+" and locStr is "+loc);
          uploadLocAPI(true,{sessionId,locStr:loc});
       }else{

       }
    }
    handleItemClick=(item)=>{
       const link=item.flink;
       if(link){
       	  location.href=link;
       }
    }
    handleClickBall=()=>{
        const _this=this;
        if(this.localId){
          stopPlayVoice(this.localId,()=>{
             _this.localId=0;
          })
        }
        speak(this.handleSpeak);
    }
    handleSpeak=(result)=>{
       let text="";
       if(result && String(result['success'])=='true'){
        text=result.data && result.data.text;
        if(isEmpty(text)){
              return ;
          }
         text=text.replace(/[\ |\~|\，|\。|\`|\!|\！|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\？]/g,""); 
         this.dealSpeak(text);
       }
    }
    dealSpeak=(text)=>{
      const _this=this;
      const {tongyinConvertAPI,sessionId}=this.props;
      if(this.ContentTip && this.ContentTip.style.display!='none'){
        this.hideMainPage();
      }
      tongyinConvertAPI({sessionId,text})
    }
    renderAppList=()=>{
    	const {appList}=this.props;
        
    	return (
            <ul className={Styles.appList}>
                {
                	appList.map(item=><li key={item.fid} onClick={()=>this.handleItemClick(item)}>
                		<div className={Styles.iconPath}>
                        <img src={`http://172.20.71.86:8888/rest/static/Icon/${item.ficonpath}`} />
                    </div>
                		<div className={Styles.content}>
                		    <span className={Styles.title}>{item.ftitle}</span>
                		    <span className={Styles.tip}>{item.ftips}</span>
                		</div>
                		<div className={Styles.arrow}></div>
                		</li>)
                }
            </ul>
    	)
    }
    //渲染对话框
    renderDialog=(item)=>{
        const {kdIntention,type}=item;
        if(kdIntention!=null && kdIntention['intention'] && kdIntention['intention'].toUpperCase()=='BUS_TRIP'){
           const wordslot=kdIntention.kdWordslots;
           let reason=wordslot.filter(item=>item.number=='user_reason')[0];
           reason=reason && reason['originalWord'];
           return <Dialog title={reason ? reason : DIALOG_TITLE} className={Styles.dialog} content={()=>this.handleDialogContent(kdIntention['kdWordslots'])} 
           onSubmit={item.type=='URL' ? ()=>this.handleDialogSubmit(item) : null} onEdit={item.type=='URL' ? ()=>this.handleDialogEdit(item) : null}>
               {item.render ? item.render :null}
           </Dialog>
        } 
    }
    handleSelectItemClick=(item,key)=>{
       //console.log("key is "+key+" and itme is "+JSON.stringify(item));
    }
    renderSelect=(item)=>{
       const {data,text,title}=item;
      //console.log("selects is "+JSON.stringify(selects)+" and text is "+text);
       return <Select dataSource={data} title={title} itemKey='id' onSelectItemClick={this.handleSelectItemClick}></Select>
    }
    renderGUI=(item)=> {
        const type=item.type;
        switch(type){
          case 'SELECTS':
            return this.renderSelect(item);
          break;
          case 'TEXT':
          case 'URL':
            return this.renderDialog(item)
          break;
        }   
    }
    //对话列表
    renderDialogList=()=>{
         const {dialogList}=this.state;
         const dialogContent=dialogList.map((item,index)=>{
              const classNameStr=item.className;
              return <li className={`${Styles[classNameStr]} ${Styles['dialog-row']}`} key={item.id ? item.id : index}>
                  {this.renderGUI(item)}
                  {item.text ? <div>{item.text}</div> : null}
              </li>
         })
         return (
            <ul className={Styles.dialogList} ref={el=>this.DialogList=el}>
              <li style={{height:'58px',display:this.state.showTip ? 'flex' : 'none'}}>

              </li>
              {dialogContent}
            </ul>
         )
    }
    //用户有语音输入时，隐藏首页的应用提示信息
    hideMainPage=()=>{
        const _this=this;
        if(this.ContentTip){
           const height=this.ContentTip.scrollHeight;
           this.ContentTip.style['transform']=`translate(0,${-height}px)`;
           this.ContentTip.style['transition']='transform .15s ease-in-out';
           setTimeout(function(){
              _this.ContentTip.style['display']="none";
           },150)
        }
    }
    //发送消息
    sendMessage=(text)=>{
      let dialog=this.state.dialogList; 
      const {sessionId,chatAPI}=this.props;
      const id=FilterMaxId(dialog,'id');
      dialog.push({className:'user-dialog',text,id});
      this.setState({
            dialogList:dialog,
      },()=>{
        chatAPI({sessionId,message:text});
      })
    }
    transformDialog=()=>{
      const _this=this;
      if(this.DialogList){
          const sro=parseInt(_this.DialogList.scrollHeight) + parseInt(_this.DialogList.offsetHeight) + 1000;
          setTimeout(function(){
            ReactDOM.findDOMNode(_this.DialogList).scrollTop=sro;
          },150)
      }
    }
    getReason=(kdWordslots,key)=>{
       const result=kdWordslots.filter(kdWordslot=>kdWordslot['number']==key)[0];
       if(result){
           return result['originalWord'];
       }
    }
    //意图切换弹出提示框
    dealTip=(info)=>{
        const {intention,kdWordslots,intentionName}=info;
        console.log("info is "+intention+" and kdWordslots is "+JSON.stringify(kdWordslots));

        if(intention=='BUS_TRIP'){
          const reason=this.getReason(kdWordslots,'user_reason');
          this.tipContent= reason ? reason : '未完成的'+intentionName;
          //出差申请
          this.setState({
              showTip:true,
          })
        }
    }
    //接收消息
    acceptMessage=(props=this.props)=>{
        const _this=this;
        const {kdIntention,message,lastUnfinishedIntention}=props;
        //console.log("message is "+JSON.stringify(message)+" and kdIntention is "+JSON.stringify(kdIntention));
        let type=message && message.type;
        type=type && type.toUpperCase();
        let dialog=this.state.dialogList;
        if(lastUnfinishedIntention){
            this.dealTip(lastUnfinishedIntention);
        }
        if(isYZJ()){
          playVoice(message.text,(localId)=>{
             _this.localId=localId;
          })
        }

        switch(type){
           case 'TEXT':
               console.log("text is ");
               let text=message.text;
               dialog.push({className:'chatbot-dialog',text:text,id:FilterMaxId(dialog,'id'),kdIntention,type});
               this.setState({
                  dialogList:dialog,
               })
           break;
           case 'SELECTS':
               dialog.push({className:'chatbot-dialog',text:'',id:FilterMaxId(dialog,'id'),kdIntention,type,data:message.selects,title:message.text})
           break;
           case 'URL':
               let text1='';
               dialog.push({className:'chatbot-dialog',text:text1,id:FilterMaxId(dialog,'id'),kdIntention,type,url:message.url,
               render:()=><div className={Styles.loan}>如果有需要<span className={Styles.color}>“借款”</span>请告诉我</div>});
               this.setState({
                  dialogList:dialog,
               })
           break;
           case 'COMFIRM':

           break;
           default:

           break;
        }
    }
    handleKeyup=(e)=>{
        const _this=this;
        const {tongyinConvertAPI,sessionId,chatAPI}=this.props;
        const key=e.keyCode;
        let dialog=this.state.dialogList;
        if(key==13){
          const value=e.target.value;
          if(isEmpty(value))return;
          if(this.ContentTip && this.ContentTip.style.display!='none'){
              this.hideMainPage();
          }
          e.target.value="";
          tongyinConvertAPI({text:value,sessionId});
          //,()=>{_this.sendMessage(value);}
        }
    }
  handleDialogEdit=(item)=>{
     const url=item && item['url'];
     const urlStr=url && url['url'];
     const {dialogList}=this.state;
     const {sessionId}=this.props;
     if(urlStr){
        saveInLocalStorage('dialog',dialogList);//保存该次的会话记录
        saveInLocalStorage('sessionId',sessionId);
        location.href=urlStr;
     }
  }
  handleDialogSubmit=(item)=>{
     const url=item && item['url'];
     const urlStr=url && url['url'];
     const {dialogList}=this.state;
     if(urlStr){
        saveInLocalStorage('dialog',dialogList);
        location.href=urlStr;
     }
  }
  handleDialogContent=(wordslot)=>{
    let b_loc=SOURCE_ADDRESS,e_loc=TARGET_ADDRESS,b_t=BEGIN_TIME,e_t=BACK_TIME;
    wordslot.forEach(item=>{
       const number=item.number;
       switch(number){
         case 'user_e_l':
             e_loc=item['originalWord']+'  (目的地)';
         break;
         case 'user_b_l':
             b_loc=item['originalWord']+'  (出发地)';
         break;
         case 'user_b_t':
             b_t=item['normalizedWord'];
         break;
         case 'user_e_t':
             e_t=item['normalizedWord'];
         break;
       }
    })
    return (
       <div className={Styles.dialogContent}>
           <div className={Styles['dialogContent-left']}>
               <div className={`${Styles.loc} ${b_loc!=SOURCE_ADDRESS ? Styles['loc_fill'] : ''}`}>{b_loc}</div>
               <div className={`${Styles.loc} ${e_loc!=TARGET_ADDRESS ? Styles['loc_fill'] : ''}`}>{e_loc}</div>
           </div>
           <div className={Styles['dialogContent-right']}>
               <div className={`${Styles.time} ${b_t!=BEGIN_TIME ? Styles['time_fill'] : ''}`}>{b_t}</div>
               <div className={`${Styles.time} ${e_t!=BACK_TIME ? Styles['time_fill'] : ''}`}>{e_t}</div>
           </div>
       </div>
    )
  }
  handleTipClick=(data)=>{
      const _this=this;
      console.log("data is "+JSON.stringify(data));
      const {intention,kdWordslots,say}=data;
      let dialog=this.state.dialogList;
      if(intention=='BUS_TRIP'){
        if(isYZJ()){
          playVoice(say,(localId)=>{
             _this.localId=localId;
          })
        }
        dialog.push({className:'chatbot-dialog',text:say,id:FilterMaxId(dialog,'id'),kdIntention:{intention,kdWordslots},type:'TEXT'});
        this.setState({
          dialogList:dialog,
          showTip:false,
        })
      }
  }
	render(){
		const {title,sessionId,appList,lastUnfinishedIntention}=this.props;
    const {showTip}=this.state;
		return (
          <div className={Styles.wrapper}>
             <div className={Styles.header} ref={el=>this.Header=el}>
                 <div className={Styles.contentTip} ref={el=>this.ContentTip=el}>
                   <div className={Styles.rowTitle}>{title}</div>
                   <div className={Styles.row}>{HELP_TITLE}</div>
                   <div className={Styles.row}>{HELP_TITLE_TWO}</div>
                   {this.renderAppList()}
                 </div>
                  <Tip className={Styles.Tip} content={this.tipContent} data={lastUnfinishedIntention} onClick={this.handleTipClick} 
                  icon={require('../../images/text.png')} visible={showTip}/>
                 {this.renderDialogList()}
                 {this.transformDialog()}
             </div>
             <div className={Styles.footer}>
                 {
                    isYZJ() ? <div className={Styles.ball} onClick={this.handleClickBall}>
                     <img src={robotMic} />
                    </div> : <input placeholder="输入" onKeyUp={this.handleKeyup} />
                 }
             </div>
          </div>
		)
	}
}
const mapStateToProps=state=>{
	return {
      title:state.mainpage.title,
      sessionId:state.mainpage.sessionId,
      appList:state.mainpage.appList,
      message:state.mainpage.message,
      kdIntention:state.mainpage.kdIntention,
      text:state.mainpage.text,
      lastUnfinishedIntention:state.mainpage.lastUnfinishedIntention,
      exception:state.mainpage.exception,
	}
}
const wrapperFunc=(payload,func,dispatch)=>{
   if(typeof func=='function'){
     return func(payload)(dispatch);
   }
}
const mapDispatchToProps=(dispatch)=>{
   return {
       getMainPageData:(showLoading,payload)=>wrapperFunc(payload,fetchMainPageData,dispatch),
       uploadLocAPI:(showLoading,payload)=>wrapperFunc(payload,uploadLocation,dispatch),
       chatAPI:(payload)=>wrapperFunc(payload,chatDialog,dispatch),
       tongyinConvertAPI:(payload)=>wrapperFunc(payload,tongyinconvert,dispatch),
       getChatSessionIdAPI:(payload)=>wrapperFunc(payload,getSessionId,dispatch),
       dispatch:dispatch,


   }
}
export default connect(mapStateToProps,mapDispatchToProps)(MainPage);

/*
*                 // <div className={Styles.ball} onClick={this.handleClickBall}>
                 //    <img src={robotMic} />
                 // </div>
     <input placeholder="输入" onKeyUp={this.handleKeyup}/>
                                 <Tip className={Styles.Tip} content={'北京客户大会出差申请'}/>
*/

