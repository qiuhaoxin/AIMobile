/*
* 云之家接口
*/
import {isEmpty} from './utils';

//是否运行在云之家
export const isYZJ=()=>{
	//alert(navigator.userAgent)
	return navigator.userAgent.match(/Qing\/.*;(iOS|iPhone|Android).*/)?true:false; 
}
//获取云之家语音
export const getYZJLang=()=>{
  const userAgent=navigator.userAgent;
  return (/lang\:zh\-/g).test(userAgent)==true ? 'chinese' : 'english';
}

//获取操作系统平台，
export const getOS=()=>{
  return (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 'iOS' :
    navigator.userAgent.match(/Android/i) ? 'Android' : '' ); 
}

//获取当前用户的网络状态
export const getNetWorkType=(fn)=>{
	XuntongJSBridge.call('getNetworkType', {}, function(result){
      alert("用户网络状态："+JSON.stringify(result));
    });
}

/*
*获取当前定位
{
    success: true or false 是否成功(String)
    error: 错误信息(String)
    errorCode: 错误码(int)
    data:{'latitude'：22.2748379,                         //维度
          'longitude':133.2324334,                        //经度
          'province':'广东省',                            //省
          'city':'深圳市',                                //市
          'district':'南山区',                            //区
          'name':'金蝶软件园',                            //名称
          'address':'科技南十二道',                       //地址
          'addressdetail':广东省深圳市南山区科技南十二道'   //详细地址
    }
}
*/

export const getLocation=(fn)=>{
   XuntongJSBridge.call('getLocation',{},function(result){
   	  if(fn)fn(result);
   });
}

/*
* 选取周边地址
  options:{
	lan:'',
	lon:'',
	isLocation:'',
  }
result:
  {
    success: true or false 是否成功(String)
    error: 错误信息(String)
    errorCode: 错误码(int)
    data:{'latitude'：22.2748379,                         //维度
          'longitude':133.2324334,                        //经度
          'province':'广东省',                            //省
          'city':'深圳市',                                //市
          'district':'南山区',                            //区
          'name':'金蝶软件园',                            //名称
          'address':'科技南十二道',                       //地址
          'addressdetail':广东省深圳市南山区科技南十二道'   //详细地址
    }
}
*/
export const selectLocatoin=(options,fn)=>{
	if(isEmpty(options.lan)||isEmpty(options.lon)){
		return;
	}
	//0.9.6及以上支持
	XuntongJSBridge.call('selectLocation', {
	    'latitude':options.lan,
	    'longitude':options.lon,
	    'isLocation':options.isLocation, 
	}, function(result){
		fn && fn(result);
	});
}


/*
* 调用扫一扫
   @Param:needResult	int	否	是否需要处理，默认为0，扫描结果由云之家处理，1则直接返回扫描结果。
   result:
	{
	    success: true or false 是否成功(String)
	    error: 错误信息(String)
	    errorCode: 错误码(int)
	    data:{
	         "qrcode_str":"xxx"
	    }
	}
*/
export const scanQRCode=(fn)=>{
	XuntongJSBridge.call("scanQRCode",  {
       "needResult":0
       }, function(result) {
         fn && fn(result);
    });
}


export const back=(fn)=>{
	XuntongJSBridge.call('defback', {}, function () {
		fn && fn();
        XuntongJSBridge.call('closeWebView');
    })
}

/*
* 声音采集接口
*/
export const speak=(fn)=>{
	 XuntongJSBridge.call('voiceRecognize',{

     },function(result){
        fn && fn(result);
    })
}


/*
*暂停播报
*/
export const stopPlayVoice=(fn)=>{
   XuntongJSBridge.call('stopVoice', {localId:this.localId},
      function(result){
        fn && fn(result);
      }
  );
}


/*
* 语音播报接口
*/
export const playVoice=(msgContent,fn)=>{
    XuntongJSBridge.call('voiceSynthesize',{
        'text':msgContent,
        'voiceName':'xiaoyan'
    },function(result){
      if (result.success == true || result.success == 'true') {
            //_this.localId = result.data.localId;
            const localId=result.data.localId;
            const len = result.data.len;
            XuntongJSBridge.call('playVoice', { localId:localId},
                function(result) {
                fn && fn(result);
            });
      }
    })
}



