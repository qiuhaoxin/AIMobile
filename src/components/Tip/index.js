import React,{Component} from 'react';
import Styles from './index.less';
import PropTypes from 'prop-types';

class Tip extends Component{
   constructor(props){
      super(props);
   }
   render(){
      const {prefixCls,className,style,icon,tipStr,content}=this.props;
   	  return (
        <div style={style} className={Styles.tipWrapper}>
            <div className={Styles.contentRow}>
                {(icon && typeof icon =='string') ? <img src={icon}/> : (icon ? {icon} : null)}
                <div className={Styles.content}>
                    {content}
                </div>
            </div>
            {
            	tipStr ? <div className={Styles.tipRow}>{tipStr}</div> :null
            }
        </div>
   	  )
   }
}
Tip.defaultProps={
   tipStr:'点击或说出"填写出差申请"即可继续',
}
Tip.propTypes={
   tipStr:PropTypes.string,

}
export default Tip;