require('isomorphic-fetch');
import request from './request.js';

//172.20.71.86
//const urlPath="http://192.168.206.72/LightApp/data/";
const urlPath="http://172.20.71.86:8888/rest/ui/Mobile";

//获取配置信息
export function getMainPageData(params){
	return request(urlPath+"/getmainpagedata",{
		method:'POST',
		body:params,
	}) 
}
