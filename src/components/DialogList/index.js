import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Styles from './index.less';
import PropTypes from 'prop-types';
import {isEmpty,FilterMaxId} from '../../utils/utils';
import * as ActionType from '../../action/actionType';
import {connect} from 'react-redux';
import {TypeIn,ExpandList,NumberCard} from 'aicomponents';

const DIALOG_TITLE="这里是标题";
const TIME_TO_SCROLL=150;
const urlMapping={
  'BUS_TRIP':'renderExtendBus_tip'
}
const SOURCE_ADDRESS="出发地",TARGET_ADDRESS='目的地',BEGIN_TIME="出发时间",BACK_TIME='返回时间';
class DialogList extends Component{
	constructor(props){
		super(props);
	}

	state={
		dialogList:[],
	}
	componentWillReceiveProps(nextProps){
        console.log("nextProps in DialogList is "+JSON.stringify(nextProps));
        if(nextProps.text && nextProps.kdIntention){
        	this.addToDialogList(nextProps);
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
            console.log("scrollTop is "+_this.DialogListDOM.scrollTop);
          },TIME_TO_SCROLL)
      }
  }
	addToDialogList=(props=this.props)=>{
        let {dialogList}=this.state;
        //console.log("dealMessageType props is "+JSON.stringify(props));
        const {message,kdIntention,text}=props;
		const id=FilterMaxId(dialogList,'id');
        dialogList.push({className:'user-dialog',text,id});
        const result=this.dealMessageType(message,kdIntention,dialogList);
        dialogList.push(result);
	}
  handleDialogContent=(wordslot)=>{
      let b_loc=SOURCE_ADDRESS,e_loc=TARGET_ADDRESS,b_t=BEGIN_TIME,e_t=BACK_TIME;
      wordslot.forEach(item=>{
         const number=item.number;
         switch(number){
           case 'user_e_l':
               e_loc=item['originalWord']+'  ('+TARGET_ADDRESS+')';
           break;
           case 'user_b_l':
               b_loc=item['originalWord']+'  ('+SOURCE_ADDRESS+')';
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
         <div className={`${Styles['dialogContent']}`}>
             <div className={`${Styles['dialogContent-left']}`}>
                 <div className={`${Styles['loc']} ${b_loc!=SOURCE_ADDRESS ? Styles['loc_fill'] : ''}`}>{b_loc}</div>
                 <div className={`${Styles['loc']} ${b_loc!=TARGET_ADDRESS ? Styles['loc_fill'] : ''}`}>{e_loc}</div>
             </div>
             <div className={`${Styles['dialogContent-right']}`}>
                 <div className={`${Styles['time']} ${b_t!=BEGIN_TIME ? Styles['time_fill'] : ''}`}>{b_t}</div>
                 <div className={`${Styles['time']} ${b_t!=BACK_TIME ? Styles['time_fill'] : ''}`}>{e_t}</div>
             </div>
         </div>
      )
  }
	//渲染对话框
    renderDialog=(item)=>{
        const {kdIntention,type,text}=item;
        const {say}=kdIntention;
        const {dialogList}=this.props;
        if(kdIntention!=null && kdIntention['intention'] && kdIntention['intention'].toUpperCase()=='BUS_TRIP'){
           const wordslot=kdIntention.kdWordslots;
           let reason=wordslot.filter(item=>item.number=='user_reason')[0];
           reason=reason && reason['originalWord'];
           return <TypeIn title={reason ? reason : DIALOG_TITLE} className={Styles.dialog} say={say} content={()=>this.handleDialogContent(kdIntention['kdWordslots'])} 
           onSubmit={item.type=='URL' ? ()=>this.handleDialogSubmit(item) : null} onEdit={item.type=='URL' ? ()=>this.handleDialogEdit(item) : null}>
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
       // const text=item.desc;
       // const id=FilterMaxId(tempArr,'id');
       // tempArr.push({className:'user-dialog',text,id});
       // const tempArr1=tempArr.filter(item=>item.id!=-1);
       // this.setState({
       //    dialogList:tempArr1,
       // },()=>{
       //    _this.chat(item.value);
       // })
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
       //console.log("item is "+JSON.stringify(item));
       const {message}=this.props;
       const {numberCard}=message;
       return <NumberCard data={numberCard}></NumberCard>

    }
    renderGUI=(item)=> {
        //console.log("itemddd is "+JSON.stringify(item));
        const type=item.type;
        console.log("type is "+type);
        switch(type){
          case 'SELECTS':
            return this.renderSelect(item);
          break;
          case 'TEXT':
          case 'URL':
            return this.renderDialog(item);
          break;
          case 'NUMBER_CARD':
            return this.renderNumberCard(item);
          break;
        }   
    }
	dealMessageType=(message,kdIntention,dialogList)=>{
		let result={};
        let type=message && message.type;
        type=type && type.toUpperCase();
        // if(isYZJ() && message.text && !isEmpty(message.text)){
        //   playVoice(message.text,(localId)=>{
        //      _this.localId=localId;
        //   })
        // }

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
               result={className:'chatbot-dialog',text:text1,id:FilterMaxId(dialogList,'id'),kdIntention,type,url:message.url}
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
		const {dialogList}=this.state;
		const dialogStr=dialogList.map(item=>{
			const classNameStr=item.className;
			return <li key={item.id} className={`${Styles[classNameStr]} ${Styles['dialog-row']}`}>
			    {
			    	item.kdIntention ? this.renderGUI(item) : <div>{item.text}</div>
			    }
		    </li>
		})
		return (
           <ul className={`${Styles.dialogList}`} ref={el=>this.DialogListDOM=el}>
               {
               	  dialogStr
               }
           </ul>
		)
	}
	render(){
		const {visible}=this.props;
		const classNameStr=visible ? 'ai-dl-show' : 'ai-dl-hide'; 
		return (
			<div className={`${Styles.wrapper} ${Styles[classNameStr]}`}>
                {
                	this.renderDialogList()
                }
                {
                  this.transformDialog()
                }
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