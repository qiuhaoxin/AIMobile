import React,{Component} from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import Styles from './index.less';
import {connect} from 'react-redux';
import {fetchMainPageData} from '../../action/mainpage';

class MainPage extends Component{
	constructor(props){
		super(props);
	}
    componentDidMount(){
        const {getMainPageData}=this.props;
        getMainPageData(true,{bizSysId:9});
    }
    componentWillReceiveProps(nextProps){
    	console.log("nextProps is "+JSON.stringify(nextProps));
    }
    handleItemClick=(item)=>{
       console.log("item is "+JSON.stringify(item));
       const link=item.flink;
       if(link){
       	  location.href=link;
       }
    }
    renderAppList=()=>{
    	const {appList}=this.props;
        
    	return (
            <ul className={Styles.appList}>
                {
                	appList.map(item=><li key={item.fid} onClick={()=>this.handleItemClick(item)}>
                		<div className={Styles.iconPath}></div>
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
		console.log("title is "+title+" and sessionId is "+sessionId+" and appList is "+JSON.stringify(appList));
		return (
          <div className={Styles.wrapper}>
               <div className={Styles.row}>{title}</div>
               <div className={Styles.row}>请问需要什么帮助?</div>
               <div className={Styles.row}>你可以这样问我:</div>
               {this.renderAppList()}
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
const mapDispatchToProps=(dispatch)=>{
   return {
      getMainPageData:(showLoading,payload)=>fetchMainPageData(showLoading,payload)(dispatch),
   }
}
export default connect(mapStateToProps,mapDispatchToProps)(MainPage);