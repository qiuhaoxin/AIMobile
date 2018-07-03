import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import className from 'classnames';
import Styles from './index.less';
import {connect} from 'react-redux';
import {fetchMainPageData,uploadLocation,chatDialog,tongyinconvert,getSessionId} from '../../action/mainpage';
import {isYZJ,getNetWorkType,getLocation,speak,getYZJLang,getOS,backYZJ,playVoice,stopPlayVoice} from '../../utils/yzj';
import {isEmpty,FilterMaxId,saveInLocalStorage,getInLocalStorage,delInLocalStorage} from '../../utils/utils';
import Dialog from '../../components/Dialog'; 
import Tip from '../../components/Tip';
import Select from '../../components/Selects';

import robotMic from '../../images/robot_mic.png';
import logo from '../../images/logo.gif';

class MainPage extends Component{
  	constructor(props){
  		super(props);
  	}
    state={
      dialogList:[],
      showTip:false,//控制顶部Tip可见性
    }
    componentWillMount(){
       backYZJ(function(){
         delInLocalStorage('dialog');
       })
    }
    componentDidMount(){
        const {getMainPageData,uploadLoc}=this.props;
        if(isYZJ()){
           getLocation(this.uploadLocation);
           //this.uploadLocation({success:'true',data:{city:'深圳市'}})
        }
        this.getSessionIdFirst();
        const result=getInLocalStorage('dialog');
        //console.log("result is "+JSON.stringify(result));
        if(result){
           this.hideMainPage();
           //delInLocalStorage('dialog');
           this.setState({
              dialogList:result,
           })
        }else{
          //有会话记录就恢复记录，没有请求主页数据
          getMainPageData(true,{bizSysId:9});
        }
    }
    componentWillUnmount(){
        delInLocalStorage('dialog');
    }
    getSessionIdFirst=()=>{
       const {getChatSessionIdAPI}=this.props;
       //const {appid,openId,uname}=this.props.match.params;
       const uname='邱浩新';
       const appid='500045674';
       const openId='5ad04e76e4b05c4b7d6245ba';
       getChatSessionIdAPI({appid,openId,uname})
    }
    uploadLocation=(result)=>{
       const {uploadLoc}=this.props;
       if(result && String(result['success'])=='true'){
          const loc=result['data']['city'];
          uploadLoc(true,{sessionId:'test',locStr:loc});
       }else{

       }
    }
    componentWillReceiveProps(nextProps){
      //接收消息
      if(nextProps.message!=null){
          this.acceptMessage(nextProps);
          this.transformDialog();
      }
      //同音转换发送消息
      if(!isEmpty(nextProps.text)){
          this.sendMessage(nextProps.text);
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
           return <Dialog title={reason ? reason : '出差事由'} className={Styles.dialog} content={()=>this.handleDialogContent(kdIntention['kdWordslots'])} 
           onSubmit={item.type=='URL' ? ()=>this.handleDialogSubmit(item) : null} onEdit={item.type=='URL' ? ()=>this.handleDialogEdit(item) : null} />
        } 
    }
    handleSelectItemClick=(item,key)=>{
       //console.log("key is "+key+" and itme is "+JSON.stringify(item));
    }
    renderSelect=(item)=>{
       const {data,text}=item;
      //console.log("selects is "+JSON.stringify(selects)+" and text is "+text);
       return <Select dataSource={data} title={text} itemKey='id' onSelectItemClick={this.handleSelectItemClick}></Select>
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
              <li style={{height:'58px',display:'none'}}>

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
      console.log("sendMessage");
      let dialog=this.state.dialogList; 
      const {sessionId,chatAPI}=this.props;

      const id=FilterMaxId(dialog,'id');
      dialog.push({className:'user-dialog',text,id});
      this.setState({
            dialogList:dialog,
      },()=>{
        console.log("text is "+text);
        chatAPI({sessionId,message:text});
      })
    }
    transformDialog=()=>{
      const _this=this;
      if(this.DialogList){
          const sro=parseInt(_this.DialogList.scrollHeight) + parseInt(_this.DialogList.offsetHeight) + 800;
          setTimeout(function(){
            ReactDOM.findDOMNode(_this.DialogList).scrollTop=sro;
          },200)
      }
    }
    //接收消息
    acceptMessage=(props=this.props)=>{
        const _this=this;
        const {kdIntention,message}=props;
        console.log("message is "+JSON.stringify(message)+" and kdIntention is "+JSON.stringify(kdIntention));
        let type=message && message.type;
        type=type && type.toUpperCase();
        let dialog=this.state.dialogList;
        playVoice(message.text,(localId)=>{
           _this.localId=localId;
        })
        switch(type){
           case 'TEXT':
               let text=message.text;
               dialog.push({className:'chatbot-dialog',text:text,id:FilterMaxId(dialog,'id'),kdIntention,type});
               this.setState({
                  dialogList:dialog,
               })
           break;
           case 'SELECTS':
                console.log("tyep is select");
               dialog.push({className:'chatbot-dialog',text:message.text,id:FilterMaxId(dialog,'id'),kdIntention,type,data:message.selects})
           break;
           case 'URL':
               let text1='如果需要请告诉我';
               dialog.push({className:'chatbot-dialog',text:text1,id:FilterMaxId(dialog,'id'),kdIntention,type,url:message.url});
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
     if(urlStr){
        saveInLocalStorage('dialog',dialogList);
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
    let b_loc="出发地点",e_loc="出差目的地",b_t="出发时间",e_t="返回时间";
    wordslot.forEach(item=>{
       const number=item.number;
       switch(number){
         case 'user_e_l':
             e_loc=item['originalWord'];
         break;
         case 'user_b_l':
             b_loc=item['originalWord'];
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
               <div className={Styles.loc}>{b_loc}</div>
               <div className={Styles.time}>{b_t}</div>
           </div>
           <div className={Styles['dialogContent-right']}>
               <div className={Styles.loc}>{e_loc}</div>
               <div className={Styles.time}>{e_t}</div>
           </div>
       </div>
    )
  }
	render(){
		const {title,sessionId,appList}=this.props;
    const {showTip}=this.state;
		return (
          <div className={Styles.wrapper}>
             <div className={Styles.header} ref={el=>this.Header=el}>
                 <div className={Styles.contentTip} ref={el=>this.ContentTip=el}>
                   <div className={Styles.rowTitle}>{title}</div>
                   <div className={Styles.row}>请问需要什么帮助?</div>
                   <div className={Styles.row}>你可以这样问我</div>
                   {this.renderAppList()}
                 </div>
                  <Tip className={Styles.Tip} content={'北京客户大会出差申请'} icon={require('../../images/text.png')} visible={showTip}/>
                 {this.renderDialogList()}
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
       uploadLoc:(showLoading,payload)=>wrapperFunc(payload,uploadLocation,dispatch),
       chatAPI:(payload)=>wrapperFunc(payload,chatDialog,dispatch),
       tongyinConvertAPI:(payload)=>wrapperFunc(payload,tongyinconvert,dispatch),
       getChatSessionIdAPI:(payload)=>wrapperFunc(payload,getSessionId,dispatch),
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

