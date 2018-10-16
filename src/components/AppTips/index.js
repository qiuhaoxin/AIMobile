import React,{Component} from 'react';
import Styles from './index.less';
import PropTypes from 'prop-types';

class AppTips extends Component{
	constructor(props){
		super(props);
	}
	componentWillReceiveProps(nextProps){

	}
	renderTipList=()=>{
		const {appTips}=this.props;
		console.log("appTips is "+JSON.stringify(appTips));
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
                <div className={`${Styles.tipMsg}`}>
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