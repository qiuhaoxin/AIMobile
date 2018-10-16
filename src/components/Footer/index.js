import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Styles from './index.less';
import {isYZJ,speak,getYZJLang,getOS,playVoice,stopPlayVoice,startSpeech,stopSpeech} from '../../utils/yzj';
import SiriWave from '../../lib/SiriWave';
import xiaok from '../../images/xiaok.png';
import * as ActionType from '../../action/actionType';
import {isEmpty,FilterMaxId,saveInLocalStorage,getInLocalStorage,delInLocalStorage,getValueFromUrl} from '../../utils/utils';
import {connect} from 'react-redux';
let isSupportYZJApi=true;
let talk=startSpeech;
let stopTalk=stopSpeech;

class Footer extends Component{
	constructor(props){
		super(props);
    this.xkStatus='start'; // 记录小K的状态:start  or  stop 
    this.localId=-1;
	};
	state={
		inputStr:'',
	}
  componentDidMount(){
      try{
        this.checkyyAP();//检测云之家当前版本是否支持最新的语音接口
      }catch(e){

      }
  }
  state={
      showWave:false,
      //localId:-1
  }
  componentWillReceiveProps(nextProps){
      if(nextProps.startRecord){
        this.handleClickBall();
      }
      if(nextProps.localId && nextProps.localId!=-1){
         this.localId=nextProps.localId;
         // this.setState({
         //    localId:nextProps.localId,
         // })
      }
  }
  checkyyAP=()=>{
      stopSpeech((errorCode,error)=>{
          if(error){
              alert("error in checkyyAP!");
              talk=speak;
              stopTalk=null;
              isSupportYZJApi=false;
          }
      })
  }
	handleSpeak=(result)=>{
       let text="";
       if(result && String(result['success'])=='true'){
        text=result.data && result.data.text;
        if(isEmpty(text)||text==undefined){
             //alert("文本是"+text+"请从新采集");
             return ;
          }
         text=text.replace(/[\ |\~|\，|\。|\`|\!|\！|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\？]/g,""); 
         this.dealSpeak(text);
       }
    }
    dealSpeak=(text)=>{
      const _this=this;
      const {sessionId,onEnterClick}=this.props;
      if(this.ContentTip && this.ContentTip.style.display!='none'){
        this.hideMainPage();
        this.showDialogList();
      }
      onEnterClick && onEnterClick(text);
    }
    stopVoice=()=>{
        const _this=this;
        const {localId,dispatch}=this.props;
        if(this.localId!=-1){
          try{
            stopPlayVoice(this.localId,()=>{
               _this.localId=-1;
               dispatch({
                  type:ActionType.LOCAL_ID,
                  payload:{
                    localId:-1,
                  }
               })
            })
          }catch(e){
             alert("e is "+e);
          }
        }
    }
    handleClickBall=()=>{
        const _this=this;
        const {showWave}=this.state;
        const {dispatch}=this.props;
        this.stopVoice();
        this.changeSpeakStyle();
        this.setState({
          showWave:!showWave ? true :false,
        })
        //speak(this.handleSpeak);
       startSpeech((result)=>{  
           const data=result.data;
            //隐藏图片按钮，显示声波图
           //isSupportYZJApi && this.changeSpeakStyle('none','block');
           try{
             if(isSupportYZJApi){
                 const status=data.status;
                 switch(status){
                    case 1://录音开始

                    break;
                    case 2://录音结束
                       //_this.changeSpeakStyle('block','none');
                       _this.setState({
                          showWave:false,
                       })
                       stopSpeech();
                    break;
                    case 3://音量变化
                        const percent=data.percent;
                        if(_this.siriWave){
                          _this.timeoutId=setTimeout(function(){ 
                             if(_this.timeoutId){
                                clearTimeout(_this.timeoutId);
                                _this.timeoutId=0;
                             }
                             let rand=percent * 0.6;
                             _this.siriWave.setSpeed(rand);
                          },200)
                        }
                    break;
                    case 4://识别出错
                        const errorCode=data.errorCode; //只能是1
                        const errorMessage=data.errorMessage;
                        //_this.changeSpeakStyle('block','none');
                        _this.setState({
                           showWave:false,
                        })
                    break;
                    case 5://识别结果
                        const result=data.result;
                        const isLast=data.isLast;//语音识别是否结束
                        //_this.changeSpeakStyle('block','none');
                        _this.setState({
                          showWave:false,
                        },()=>{
                          dispatch({
                            type:ActionType.START_RECORD,
                            payload:{
                              startRecord:false,
                            }
                          })
                          const tempResult={success:'true',data:{text:result}};
                          stopSpeech();
                          _this.handleSpeak(tempResult);
                        })
                    break;
                 }
             }else{
                //兼容旧版的API
                _this.handleSpeak(result);
             }
           }catch(e){
              alert("exception is "+e);
           }
       });
    }
        //SpeakIconStyle 图标样式,WaveStyle 声波图样式   
    changeSpeakStyle=(SpeakIconStyle='block',WaveStyle='none')=>{
      const _this=this;
      // if(SpeakIconStyle==WaveStyle){
      //   console.warn("两个的样式不能一致!");
      //   return;
      // }
      // if(this.SpeakIcon){
      //   this.SpeakIcon.style['display']=SpeakIconStyle;
      // }
      // if(this.Wave){
      //   this.Wave.style['display']=WaveStyle;
      // }
      if(!this.siriWave && isSupportYZJApi){
        this.siriWave = new SiriWave({
            container: this.Wave,
            width: 222,
            height: 30,
            speed: 0.12,//[0.01-0.03]
            amplitude: 1,
            autostart: true,
            style: 'ios9',
            clickCB:function(){
              //stopTalk && stopTalk(()=>_this.changeSpeakStyle('block','none'))  
              _this.setState({
                showWave:false,
              })
            }
        });
      }
    }
    handleKeyup=(e)=>{
        const _this=this;
        const {sessionId,dispatch,onEnterClick}=this.props;
        const key=e.keyCode;
        //let dialog=this.state.dialogList;
        if(key==13){
          const value=e.target.value;
          if(isEmpty(value))return;
          e.target.value="";
          onEnterClick && onEnterClick(value);
        }
    }
	render(){
    const {showWave}=this.state;
		return (
           <div className={Styles.wrapper}>
                <div ref={el=>this.SpeakIcon=el} style={{display:showWave ? 'none' : 'block'}}>
                 {
                       isYZJ() ? 
                       <div className={Styles.ball} onClick={this.handleClickBall}>
                          <img src={xiaok} />
                       </div>                       :
                       <input placeholder="输入" onKeyUp={this.handleKeyup} />
         
                 }
                </div>
                <div ref={el=>this.Wave=el} style={{display:showWave ? 'block' : 'none'}}>
  
                </div>
           </div>
		)
	}
}
Footer.defaultProps={

}
Footer.propTypes={
	onEnterClick:PropTypes.func.isRequired,
}

export default connect(state=>({
    localId:state.mainpage.localId,
    startRecord:state.mainpage.startRecord,
}))(Footer);

/*
                       isYZJ() ? 
                       <div className={Styles.ball} onClick={this.handleClickBall}>
                          <img src={xiaok} />
                       </div> : 
                       :
                       <input placeholder="输入" onKeyUp={this.handleKeyup} />

                                       <input placeholder="test" value={this.state.localId} style={{width:'98%'}}/>
*/
