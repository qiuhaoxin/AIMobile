const path=require('path');
const webpack=require('webpack');


module.exports={
	entry:{
		vendor:['react','react-dom','react-router-dom','redux','prop-types','react-redux','redux-saga','classnames'],
	},
	output:{
		path:path.join(__dirname,'../','static'),
		filename:'dll.[name].js',
		library:'[name]',
	},
	plugins:[
       new webpack.DllPlugin({
       	  name:'[name]',
       	  path:path.join(__dirname,'../','[name].manifest.json'),
       })
	]
}