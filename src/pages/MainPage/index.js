import React,{Component} from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import Styles from './index.less';
import {connect} from 'react-redux';
import {fetchMainPageData,uploadLocation,chatDialog,tongyinconvert,getSessionId} from '../../action/mainpage';
import {isYZJ,getNetWorkType,getLocation,speak,getYZJLang} from '../../utils/yzj';
import {isEmpty,FilterMaxId} from '../../utils/utils';
import Dialog from '../../components/Dialog'; 
import Tip from '../../components/Tip';

import robotMic from '../../images/robot_mic.png';
import logo from '../../images/logo.gif';

class MainPage extends Component{
  	constructor(props){
  		super(props);
  	}
    state={
      dialogList:[],
    }
    componentDidMount(){
        const {getMainPageData,uploadLoc}=this.props;
        getYZJLang();
        if(isYZJ()){
           getLocation(this.uploadLocation);
           //this.uploadLocation({success:'true',data:{city:'深圳市'}})
        }
        this.getSessionIdFirst()
        //console.log("location is "+location.href+" search is "+location.search);
        getMainPageData(true,{bizSysId:9});
    }
    getSessionIdFirst=()=>{
       const {getChatSessionIdAPI}=this.props;
       const {appid,openId,uname}=this.props.match.params;
       console.log("appid is "+appid+" and username is "+uname+" and opendi is "+openId);
       getChatSessionIdAPI({appid,openId,uname})
    }
    uploadLocation=(result)=>{
       const {uploadLoc}=this.props;
       //alert("loc result is "+JSON.stringify(result));
       if(result && String(result['success'])=='true'){
          const loc=result['data']['city'];
          uploadLoc(true,{sessionId:'test',locStr:loc});
       }else{

       }
    }
    componentWillReceiveProps(nextProps){
    	//console.log("nextProps is "+JSON.stringify(nextProps));
      if(nextProps.message!=null){
          console.log("message is "+JSON.stringify(nextProps.message));
          this.acceptMessage(nextProps.message);
          this.transformDialog();

      }
    }
    handleItemClick=(item)=>{
       console.log("item is "+JSON.stringify(item));
       const link=item.flink;
       if(link){
       	  location.href=link;
       }
    }
    handleClickBall=()=>{
        // this.Header.scrollTop=800;
        // this.Header.style['transition']="scrollTop 5s";
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
      this.ajax("tongyinConvert",{sessionId:window.chatSessionId,text:text},function(data){
              //console.log("data is "+JSON.stringify(data))
        if(data['code']=='00'){
              text=data['text'];
              _this.mode=1;
              _this.sendMessage(text);
              _this.mode=0;
        }else{
            alert("ex is "+data['text']);
        }
      }); 
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
    //对话列表
    renderDialog=()=>{
         const {dialogList}=this.state;
         const dialogContent=dialogList.map((item,index)=>{
          const classNameStr=item.className;
          return <li className={`${Styles[classNameStr]} ${Styles['dialog-row']}`} key={item.id ? item.id : index}>{item.text}</li>
        })
         return (
            <ul className={Styles.dialogList} ref={el=>this.DialogList=el}>
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
      const {sessionId,chatAPI}=this.props;
      console.log("text is "+text+" and sessionId is "+sessionId);
      chatAPI({sessionId,message:text});
    }
    transformDialog=()=>{
      const _this=this;
      if(this.DialogList){
          const sro=_this.DialogList.scrollHeight + _this.DialogList.offsetHeight + 500;
          setTimeout(function(){
            _this.DialogList.scrollTop=sro;
          },200)
      }
    }
    //接收消息
    acceptMessage=(message)=>{
        console.log("message is "+JSON.stringify(message));
        let type=message && message.type;
        type=type && type.toUpperCase();
        let dialog=this.state.dialogList;
        switch(type){
           case 'TEXT':
               const text=message.text;
               dialog.push({className:'chatbot-dialog',text:text,id:FilterMaxId(dialog,'id')});
               this.setState({
                  dialogList:dialog,
               })
           break;
           case 'SELECTS':

           break;
           case 'URL':

           break;
           case 'COMFIRM':

           break;
           default:

           break;
        }
    }
    handleKeyup=(e)=>{
        const _this=this;
        const value=e.target.value;
        const key=e.keyCode;
        const {chatAPI,tongyinConvertAPI}=this.props;
        let dialog=this.state.dialogList;
        if(key==13){
          if(this.ContentTip && this.ContentTip.style.display!='none'){
              this.hideMainPage();
          }
          const id=FilterMaxId(dialog,'id');
          dialog.push({className:'user-dialog',text:value,id});
          e.target.value="";
          this.setState({
            dialogList:dialog,
          },()=>{
             _this.sendMessage(value);
          })
        }
    }
  handleDialogEdit=()=>{
     console.log("edit");
  }
  handleDialogSubmit=()=>{
     console.log("submit");
  }
  handleDialogContent=()=>{
    return (
       <div className={Styles.dialogContent}>
           <div className={Styles['dialogContent-left']}>
               <div className={Styles.loc}>深圳</div>
               <div className={Styles.time}>出发时间</div>
           </div>
           <div className={Styles['dialogContent-right']}>
               <div className={Styles.loc}>广州</div>
               <div className={Styles.time}>返回时间</div>
           </div>
       </div>
    )
  }
	render(){
		const {title,sessionId,appList}=this.props;
		//console.log("title is "+title+" and sessionId is "+sessionId+" and appList is "+JSON.stringify(appList));
		return (
          <div className={Styles.wrapper}>
             <div className={Styles.header} ref={el=>this.Header=el}>
                 <div className={Styles.contentTip} ref={el=>this.ContentTip=el}>
                   <div className={Styles.rowTitle}>{title}</div>
                   <div className={Styles.row}>请问需要什么帮助?</div>
                   <div className={Styles.row}>你可以这样问我</div>
                   {this.renderAppList()}
                 </div>
                  <Tip className={Styles.Tip} content={'北京客户大会出差申请'} icon={require('../../images/text.png')}/>
                 {this.renderDialog()}
             </div>
             <div className={Styles.footer}>
                 <input placeholder="输入" onKeyUp={this.handleKeyup}/>
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

                                 <Tip className={Styles.Tip} content={'北京客户大会出差申请'}/>
*/

