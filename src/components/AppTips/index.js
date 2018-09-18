import React,{Component} from 'react';
import Styles from './index.less';
import PropTypes from 'prop-types';

class AppTips extends Component{
	constructor(props){
		super(props);
		this.data=[
           '我明天要去北京出差',
           '我要出差去北京',
           '我9号去北京出差',
           '我明天出差北京,下周二回来',
           '出差去北京参加客户大会',
		]
	}
	componentWillReceiveProps(nextProps){

	}
	renderTipList=()=>{
		const appTips=this.data;
		const listStr=appTips.map((item,index)=><li key={index}>
            <div>{item}</div>
		</li>)
		return (
           <ul>
                {listStr}
           </ul>
		)
	}
	render(){
		const {desc,visible}=this.props;
        const classNameStr=visible ? 'ai-at-show' : 'ai-at-hide';
        console.log("classNameStr is "+classNameStr);
		return (
			<div className={`${Styles.wrapper} ${Styles[classNameStr]}`}>
                <div>
                    {desc}
                </div>
                {
                	this.renderTipList()
                }
			</div>
		)
	}
}
AppTips.defaultProps={
	desc:'您可以这么说',
	visible:false,
}
AppTips.propTypes={
	desc:PropTypes.string,
	visible:PropTypes.bool,
}
export default AppTips;