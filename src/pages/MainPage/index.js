import React,{Component} from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import Styles from './index.less';
import {connect} from 'react-redux';
import {fetchMainPageData,uploadLocation} from '../../action/mainpage';
import {isYZJ,getNetWorkType,getLocation,speak} from '../../utils/yzj';
import {isEmpty} from '../../utils/utils';

import robotMic from '../../images/robot_mic.png';
import logo from '../../images/logo.gif';

class MainPage extends Component{
  	constructor(props){
  		super(props);
  	}
    componentDidMount(){
        const {getMainPageData,uploadLoc}=this.props;
        if(isYZJ()){
           getLocation(this.uploadLocation);
           //this.uploadLocation({success:'true',data:{city:'深圳市'}})
        }

        getMainPageData(true,{bizSysId:9});
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
    }
    handleItemClick=(item)=>{
       console.log("item is "+JSON.stringify(item));
       const link=item.flink;
       if(link){
       	  location.href=link;
       }
    }
    handleClickBall=()=>{
        if(this.ContentTip){
          // const height=this.ContentTip.scrollHeight;
          //  this.ContentTip.style['transform']=`translate(0,${-height}px)`;
          //  this.ContentTip.style['transition']='transform .1s linear';
          
          //this.ContentTip.scrollTop=height+"px";
         // this.listContianer.scrollTop=this.listContianer.scrollHeight + this.listContianer.offsetHeight + 50;
        }
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
             </div>
             <div className={Styles.footer}>
                 <div className={Styles.ball} onClick={this.handleClickBall}>
                    <img src={robotMic} />
                 </div>
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
	}
}
const wrapperFunc=(showLoading,payload,func,dispatch)=>{
   if(typeof func=='function'){
     return func(showLoading,payload)(dispatch);
   }
}
const mapDispatchToProps=(dispatch)=>{
   return {
       getMainPageData:(showLoading,payload)=>wrapperFunc(showLoading,payload,fetchMainPageData,dispatch),
       uploadLoc:(showLoading,payload)=>wrapperFunc(showLoading,payload,uploadLocation,dispatch),
   }
}
export default connect(mapStateToProps,mapDispatchToProps)(MainPage);
