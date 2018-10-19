import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Styles from './index.less';
import PropTypes from 'prop-types';
import {isEmpty,FilterMaxId,saveInLocalStorage,getInLocalStorage} from '../../utils/utils';
import {isYZJ,speak,backYZJ,playVoice,stopPlayVoice,startSpeech,stopSpeech} from '../../utils/yzj';
import * as ActionType from '../../action/actionType';
import {connect} from 'react-redux';
import {TypeIn,ExpandList,NumberCard,VoiceReceive,Tip,Frame} from 'aicomponents';
import Iscroll from '../Iscroll';
import imgPath from '../../images/bus.png';
import cloneDeep from 'lodash/cloneDeep';

const DIALOG_TITLE="请填写出差事由";
const GOOD_JOB="谢谢您的认可，来不及认识你，还好在心中留住了你!";
const GOOD_BYB="很遗憾没有帮到你，你有什么想对小K说的吗？小K会认真听取建议的";
const TIME_TO_SCROLL=150;
const TIME_TO_VOICE=12000;
const urlMapping={
  'BUS_TRIP':'renderExtendBus_tip'
}
const bus_trip=[
    {text:'出发地',number:'user_b_l'},
    {text:'目的地',number:'user_e_l'},
    {text:'出发时间',number:'user_b_t'},
    {text:'返回时间',number:'user_e_t'},
]
const SOURCE_ADDRESS="出发地",TARGET_ADDRESS='目的地',BEGIN_TIME="出发时间",BACK_TIME='返回时间';
class DialogList extends Component{
	constructor(props){
		super(props);
    this.timeoutId=-1;
    this.wrapperHeight=0;
	}
	state={
		dialogList:[],
    showTip:false,
	}
	componentWillReceiveProps(nextProps){
        if(nextProps.text){
          this.addUserDialog(nextProps);
          if(nextProps.text=='提交'){
            //this.dealBusSubmit();
          }
        }
        if(nextProps.kdIntention!=null){
          this.addSystemDialog(nextProps);
        }
	}
  componentDidMount(){
      const dialogList=getInLocalStorage('dialog');
      const sessionId=getInLocalStorage('sessionId');
      if(dialogList){
        this.setState({
          dialogList
        })
      }
  }
	chat=(text)=>{
		const {dispatch,sessionId}=this.props;
		dispatch({
			type:ActionType.CHAT,
			payload:{sessionId,message:text},
		})
	}
  transformDialog=()=>{
      const _this=this;
      if(this.DialogListDOM){
          const sro=parseInt(_this.DialogListDOM.scrollHeight) + parseInt(_this.DialogListDOM.offsetHeight) + 10000;
          setTimeout(function(){
            ReactDOM.findDOMNode(_this.DialogListDOM).scrollTop=sro;
          },TIME_TO_SCROLL)
      }
  }
  translateList=(listHeight)=>{
     if(this.wrapper){
         this.wrapper.scrollTo(0,-listHeight,500,{});
     }
  }
  delIntention=(props)=>{
      const {dialogList}=this.state;
      const _this=this;
      const dialogListClone=cloneDeep(dialogList);
      //console.log("dialogListClone is "+JSON.stringify(dialogList));
      dialogListClone.forEach(item=>{
        if(item.className=='chatbot-dialog'){
          item.kdIntention=null;
        }
      })
      console.log("dialogListClone is "+JSON.stringify(dialogListClone));
      this.setState({
        dialogList:dialogListClone,
      },()=>{
          setTimeout(function(){
            const listHeight=_this.DialogListWrapper.clientHeight;
            console.log("listH is "+listHeight);
            if(listHeight!=0){
              _this.translateList(listHeight);
            }
            const {text}=props;
            const id=FilterMaxId(dialogList,'id');
            let tempArr=dialogListClone;
            tempArr.push({className:'user-dialog',text,id})
            _this.setState({
               dialogList:tempArr,
            })
          },100)
      })
  }
  addUserDialog=(props=this.props)=>{
        let {dialogList}=this.state;
        // if(dialogList.length>0){
        //    this.delIntention(props);
        // }
        const listHeight=this.DialogListWrapper.clientHeight;
        if(listHeight!=0){
          this.translateList(listHeight);
        }
       // if(dialogList.length==0){
          const {text}=props;
          const id=FilterMaxId(dialogList,'id');
          dialogList.push({className:'user-dialog',text,id});
        //}
  }
  addSystemDialog=(props=this.props)=>{
        let {dialogList}=this.state;
        const {message,kdIntention,text,lastUnfinishedIntention}=props;
        const result=this.dealMessageType(message,kdIntention,dialogList);
        //如果意图切换了，弹出Tip提醒可以返回上个意图
        if(lastUnfinishedIntention){
            this.dealTip(lastUnfinishedIntention);
        }
        dialogList.push(result);
        this.dealDialogEnd(status);
  }
  getReason=(kdWordslots,key)=>{
       const result=kdWordslots.filter(kdWordslot=>kdWordslot['number']==key)[0];
       if(result){
           return result['originalWord'];
       }
  }
  dealTip=(info)=>{
        const {intention,kdWordslots,intentionName}=info;
        if(intention=='BUS_TRIP'){
          const reason=this.getReason(kdWordslots,'user_reason');
          this.tipContent= (reason ? reason : '未完成的')+intentionName;
          //出差申请
          this.setState({
              showTip:true,
          })
        }else{
          this.setState({
            showTip:false,
          })
        }
  }
  handleTipClick=(data)=>{
      const _this=this;
      const {dispatch,sessionId}=this.props;
      const {intention,kdWordslots,say}=data;
      this.setState({
         showTip:false,
      },()=>{
        dispatch({type:ActionType.SAY,payload:{text:'填写出差申请',sessionId}});
      })
      
  }
  dealDialogEnd=(status)=>{
        const _this=this;
        let {dialogList}=this.state;
        if(this.timeoutId!=-1){
           clearTimeout(this.timeoutId);
           this.timeoutId=-1;
        }
        if(status=='satisfy'){
          this.timeoutId=setTimeout(function(){
              dialogList.push({className:'chatbot-dialog',text:'要是没有问题了，小K就退下啦',type:'VOICERECEIVE',id:FilterMaxId(dialogList,'id')});
              dialogList=dialogList.filter(item=>item.id!=-1);
              _this.setState({
                dialogList,
              })
          },TIME_TO_VOICE);
        }else{
          clearTimeout(this.timeoutId);
          this.timeoutId=-1;
        }
  }
  handleDialogContent=(wordslot)=>{
      return (
         <div className={`${Styles['dialogContent']}`}>
              <ul>
                 {
                  bus_trip.map(item=>{
                    const tempItem=wordslot.filter(item1=>item1.number==item.number);

                    return <li key={item.number}>
                        <div className={`${Styles['dialogCotnent-left']}`}>
                            {item.text}
                        </div>
                        <div className={`${Styles['dialogContent-right']}`}>
                            {tempItem && tempItem.length > 0 ? tempItem[0].normalizedWord : ''}
                        </div>
                  </li>
                  })
                 }
              </ul>
         </div>
      )
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
  //处理出差申请的点击提交按钮效果
  dealBusSubmit=()=>{
     const {dialogList}=this.state;
     const id=FilterMaxId(dialogList,'id');
     let lastChild=cloneDeep(dialogList.slice(dialogList.length - 2,dialogList.length - 1)[0]);
     lastChild.id=id;
     lastChild.showMasker=true;
     lastChild.text="小K正在为您提交单据，请稍后...";
     console.log("lastChild is "+JSON.stringify(lastChild));
     dialogList.push(lastChild);
  }
  handleDialogSubmit=(item)=>{
     const url=item && item['url'];
     const {dispatch,sessionId}=this.props;
     dispatch({
        type:ActionType.SAY,
        payload:{
           sessionId,text:'提交'
        }
     })
  }
	//渲染对话框
    renderDialog=(item)=>{
        const {kdIntention,type,text}=item;
        const _this=this;
        const {say}=kdIntention;
        const {dialogList}=this.props;
        if(kdIntention!=null && kdIntention['intention'] && kdIntention['intention'].toUpperCase()=='BUS_TRIP'){
           const wordslot=kdIntention.kdWordslots;
           let reason=wordslot.filter(item=>item.number=='user_reason')[0];
           reason=reason && reason['originalWord'];
           return <TypeIn imgPath={imgPath} title={reason ? reason : DIALOG_TITLE} kdIntention={kdIntention} className={Styles.dialog} say={text} 
                     content={()=>this.handleDialogContent(kdIntention['kdWordslots'])} 
                     onSubmit={kdIntention.status=='confirm' ? ()=>_this.handleDialogSubmit(item) : null} showMasker={item.showMasker}>
                       {item.type=='URL' ? this[urlMapping[kdIntention['intention']]] : null}
                  </TypeIn>
        }else if(kdIntention!=null && kdIntention['intention'] && kdIntention['intention'].toLowerCase()=='enquire_financial_indicators'){
           return <TypeIn say={text}></TypeIn>
        }else{
          return <TypeIn say={text}></TypeIn>
        }
    }
    handleSelectItemClick=(item)=>{
       let tempArr=this.state.dialogList;
       const _this=this;
       const {sessionId,dispatch}=this.props;
       this.chat(item.desc);
    }
    renderSelect=(item)=>{
       const {data,text,title,kdIntention}=item;
       this.data={
           desc:kdIntention.say,
           list:data
      }
       return <ExpandList data={this.data} title={title} itemKey='id' onItemClick={this.handleSelectItemClick}></ExpandList>
    }
    renderNumberCard=(item)=>{
       const {message}=item;
       const {numberCard}=message;
       console.log("numberCard is "+JSON.stringify(numberCard));
       numberCard.desc=numberCard.desc.replace('您好','');
       if(numberCard && numberCard.numeralDetail){
          numberCard.numeralDetail.forEach(item=>{
             console.log("item is "+JSON.stringify(item));
             item.value=item.value.replace('人民币','');
          })
       }
       return <NumberCard data={numberCard}></NumberCard>

    }
    hardToUpdate=(obj)=>{
       const tempArr=this.state.dialogList;
       const id=FilterMaxId(tempArr,'id');
       if(!obj.hasOwnProperty('id')){
          obj['id']=id;
       }
       tempArr.push(obj);
       this.setState({
          dialogList:tempArr,
       })
    }
    handleOkClick=()=>{
       const tempArr=this.state.dialogList;
       this.hardToUpdate({className:'user-dialog',text:GOOD_JOB});
    }
    handleCancelClick=()=>{
      const {dialogList}=this.state;
      this.hardToUpdate({className:'user-dialog',text:GOOD_BYB});
    }
    renderVoiceReceive=(item)=>{
        const {text}=item;
        const data={
          desc:text,
          title:'小K帮到您了吗',
          btns:[

          ],
        }
        return <VoiceReceive data={data} onOkClick={this.handleOkClick} onCancelClick={this.handleCancelClick}></VoiceReceive>
    }
    handleUrlChange=(urlStr)=>{
      const {dialogList}=this.state;
      if(urlStr){
          saveInLocalStorage('dialog',dialogList);
          location.href=urlStr;
      }
    }
    renderURL=(item)=>{
       const {url:{autoOpen,iframe,content,url}}=item;
       return (
           <div>
               {
                  iframe ? <Frame src={url} className={Styles.frame}></Frame> : 
                  <span style={{color:'#4598F0'}} onClick={()=>this.handleUrlChange(url)}>{content}</span>
               }
               
           </div>
       )
    }
    renderGUI=(item)=> {
        const type=item.type;
        switch(type){
          case 'SELECTS':
            return this.renderSelect(item);
          break;
          case 'TEXT':
            return this.renderDialog(item);
          break;
          case 'URL':
            return this.renderURL(item);
          break;
          case 'NUMBER_CARD':
            return this.renderNumberCard(item);
          break;
          case 'VOICERECEIVE':
            return this.renderVoiceReceive(item);
          break;
        }   
    }
	dealMessageType=(message,kdIntention,dialogList)=>{
        const {dispatch}=this.props;
        const _this=this;
		    let result={};
        let type=message && message.type;
        type=type && type.toUpperCase();

        if(isYZJ() && message.text && !isEmpty(message.text)){
          //播报完后如果再同一个流程内则自动开启录音
          playVoice(message.text,(localId)=>{
             dispatch({
                type:ActionType.LOCAL_ID,
                payload:{
                    localId
                }
             })
          },()=>{
              if(kdIntention && (kdIntention['status']!='satisfy' || kdIntention['status'!='confirmed'])){
                dispatch({
                  type:ActionType.START_RECORD,
                  payload:{
                    startRecord:true,
                  },
                })
              }
          })
        }
        switch(type){
           case 'TEXT':
               let text=message.text;
               result={className:'chatbot-dialog',text:text,id:FilterMaxId(dialogList,'id'),kdIntention,type};
           break;
           case 'SELECTS':
               result={className:'chatbot-dialog',text:'',id:FilterMaxId(dialogList,'id'),kdIntention,type,data:message.selects,title:message.text};
           break;
           case 'URL':
               let text1='';
               result={className:'chatbot-dialog',id:FilterMaxId(dialogList,'id'),kdIntention,type,url:message.url}
           break;
           case 'COMFIRM':

           break;
           case 'NUMBER_CARD':
              result={className:'chatbot-dialog',id:FilterMaxId(dialogList,'id'),kdIntention,type,message};
           break;
        }
		return result;
	}
	renderDialogList=()=>{
		const {dialogList,showTip}=this.state;
		const dialogStr=dialogList.map(item=>{
			const classNameStr=item.className;
			return <li key={item.id} className={`${Styles[classNameStr]} ${Styles['dialog-row']}`}>
			    {
			    	item.kdIntention || item.type=='VOICERECEIVE' ? this.renderGUI(item) : <div className={Styles.textLine}>{item.text}</div>
			    }
		    </li>
		})
		return (
        <div className={`${Styles.scroller}`} ref={el=>this.DialogListWrapper=el}>
           <ul className={`${Styles.dialogList}`} ref={el=>this.DialogListDOM=el}>
              <li style={{height:'58px',display:showTip ? 'flex' : 'none'}}>

              </li>
              {
                dialogStr
              }
           </ul>
        </div>

		)
	}
	render(){
		const {visible}=this.props;
    const {showTip}=this.state;
		const classNameStr=visible ? 'ai-dl-show' : 'ai-dl-hide'; 
		return (
			<div className={`${Styles.wrapper} ${Styles[classNameStr]}`}>
              <Iscroll ref={el=>this.wrapper=el}>
                {
                  this.renderDialogList()
                }
              </Iscroll>
                <Tip visible={showTip} content={this.tipContent} icon={require('../../images/text.png')} onClick={this.handleTipClick}></Tip>
			</div>
		)
	}
}
export default connect(state=>{
	return ({
	    message:state.mainpage.message,
	    kdIntention:state.mainpage.kdIntention,
	    lastUnfinishedIntention:state.mainpage.lastUnfinishedIntention,
	    text:state.mainpage.text,
	})
})(DialogList);

/*
                {
                  this.transformDialog()
                }
*/