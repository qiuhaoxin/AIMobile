import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import Styles from './index.less';
import {isYZJ,speak,getYZJLang,getOS,playVoice,stopPlayVoice,startSpeech,stopSpeech} from '../../utils/yzj';
import SiriWave from '../../lib/SiriWave';
import xiaoK from '../../images/xiaok.png';
import * as ActionType from '../../action/actionType';
import {isEmpty,FilterMaxId,saveInLocalStorage,getInLocalStorage,delInLocalStorage,getValueFromUrl} from '../../utils/utils';
class Footer extends PureComponent{
	constructor(props){
		super(props);
	};
	state={
		inputStr:'',
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
      const {tongyinConvertAPI,sessionId}=this.props;
      if(this.ContentTip && this.ContentTip.style.display!='none'){
        this.hideMainPage();
        this.showDialogList();
      }
      tongyinConvertAPI({sessionId,text})
    }
    handleClickBall=()=>{
        const _this=this;
        if(this.localId){
          stopPlayVoice(this.localId,()=>{
             _this.localId=0;
          })
        }
        //隐藏图片按钮，显示声波图
        isSupportYZJApi && this.changeSpeakStyle('none','block');
        //speak(this.handleSpeak);
       talk((result)=>{  
           const data=result.data;
           if(isSupportYZJApi){
               const status=data.status;
               switch(status){
                  case 1://录音开始

                  break;
                  case 2://录音结束
                     //alert("结束录音");
                     this.changeSpeakStyle('block','none');
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
                      this.changeSpeakStyle('block','none');
                  break;
                  case 5://识别结果
                      const result=data.result;
                      const isLast=data.isLast;//语音识别是否结束
                      this.changeSpeakStyle('block','none');
                      const tempResult={success:'true',data:{text:result}};
                      this.handleSpeak(tempResult);
                  break;
               }
           }else{
              //兼容旧版的API
              this.handleSpeak(result);
           }
       });
    }
        //SpeakIconStyle 图标样式,WaveStyle 声波图样式   
    changeSpeakStyle=(SpeakIconStyle='block',WaveStyle='none')=>{
      const _this=this;
      if(SpeakIconStyle==WaveStyle){
        console.warn("两个的样式不能一致!");
        return;
      }
      if(this.SpeakIcon){
        this.SpeakIcon.style['display']=SpeakIconStyle;
      }
      if(this.Wave){
        this.Wave.style['display']=WaveStyle;
      }
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
              stopTalk && stopTalk(()=>_this.changeSpeakStyle('block','none'))
             
            }
            /*   
            speed: 0.2,
            color: '#000',
            frequency: 2
            */
        });
      }
    }
    handleKeyup=(e)=>{
        const _this=this;
        const {tongyinConvertAPI,sessionId,chatAPI,dispatch,onEnterClick}=this.props;
        const key=e.keyCode;
        //let dialog=this.state.dialogList;
        if(key==13){
          const value=e.target.value;
          console.log("text is "+value);
          if(isEmpty(value))return;
          // const value=e.target.value;
          // if(isEmpty(value))return;
          // if(this.ContentTip && this.ContentTip.style.display!='none'){
          //     this.hideMainPage();
          //     this.showDialogList();
          // }
           e.target.value="";
          // tongyinConvertAPI({text:value,sessionId});
          onEnterClick && onEnterClick(value);
          //dispatch({type:ActionType.TONG_YIN_CONVERT,payload:{text:value,sessionId}})
        }
    }
	render(){
		return (
           <div className={Styles.wrapper}>
                <div ref={el=>this.SpeakIcon=el} style={{display:'block'}}>
                 {
                     isYZJ() ? 
                     <div className={Styles.ball} onClick={this.handleClickBall}>
                        <img src={xiaok} />
                     </div> 
                     : <input placeholder="输入" onKeyUp={this.handleKeyup} />
                 }
                </div>
                <div ref={el=>this.Wave=el} style={{display:'none'}}>
  
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

export default Footer;