import React,{Component} from 'react';
import Styles from './index.less';
import PropTypes from 'prop-types';
import {isEmpty,FilterMaxId} from '../../utils/utils';
import * as ActionType from '../../action/actionType';
import {connect} from 'react-redux';
import {} from 'aicomponents';
const urlMapping={
  'BUS_TRIP':'renderExtendBus_tip'
}
class DialogList extends Component{
	constructor(props){
		super(props);
	}

	state={
		dialogList:[],
	}
	componentWillReceiveProps(nextProps){
        // if(nextProps.dialog && !isEmpty(nextProps.dialog)){
        // 	console.log("nextProps in dialogList");
        // 	this.dealMessageType(nextProps.dialog);
        // }
        console.log("nextProps in DialogList is "+JSON.stringify(nextProps));
        if(nextProps.text && nextProps.kdIntention){
        	this.addToDialogList(nextProps);
        }
	}
	chat=(text)=>{
		const {dispatch,sessionId}=this.props;
		console.log("text is "+text);
		dispatch({
			type:ActionType.CHAT,
			payload:{sessionId,message:text},
		})
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
	//渲染对话框
    renderDialog=(item)=>{
        const {kdIntention,type}=item;
        if(kdIntention!=null && kdIntention['intention'] && kdIntention['intention'].toUpperCase()=='BUS_TRIP'){
           const wordslot=kdIntention.kdWordslots;
           let reason=wordslot.filter(item=>item.number=='user_reason')[0];
           reason=reason && reason['originalWord'];
           return <Dialog title={reason ? reason : DIALOG_TITLE} className={Styles.dialog} content={()=>this.handleDialogContent(kdIntention['kdWordslots'])} 
           onSubmit={item.type=='URL' ? ()=>this.handleDialogSubmit(item) : null} onEdit={item.type=='URL' ? ()=>this.handleDialogEdit(item) : null}>
               {item.type=='URL' ? this[urlMapping[kdIntention['intention']]] : null}
           </Dialog>
        } 
    }
    renderSelect=(item)=>{
       const {data,text,title}=item;
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
            return this.renderDialog(item);
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
        }
		return result;
	}
	renderDialogList=()=>{
		const {dialogList}=this.state;
		const dialogStr=dialogList.map(item=>{
			console.log("item is "+JSON.stringify(item));
			const classNameStr=item.className;
			return <li key={item.id} className={`${Styles[classNameStr]} ${Styles['dialog-row']}`}>
			    {
			    	item.kdIntention ? this.renderGUI(item) : <div>{item.text}</div>
			    }
		    </li>
		})
		return (
           <ul className={`${Styles.dialogList}`} ref={el=>this.DialogList=el}>
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