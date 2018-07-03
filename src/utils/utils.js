
/*
* 判断字符串是否为空
* @Param str 目标字符串
*/
export const isEmpty=(str)=>{
  const emptyReg=/^\s*$/;
  if(emptyReg.test(str)){
    return true;
  }
  return false;
}

/*
* 获取数组中的最大主键值 并+1
* @Param list 对象数组
* @Param columnName 主键key 如:id
*/
export const FilterMaxId=(list,columnName)=>{
    const temp=list && list[list.length-1];
    if(temp==undefined)return 1;
    if(columnName in temp)
      return parseInt(temp[columnName])+1;
    return 1;
}

/*
* localStorage 存储 
* @param key 
* @param value
*/
export const saveInLocalStorage=(key,value)=>{
   if(window.localStorage){
      window.localStorage.setItem(key,JSON.stringify(value));
   }else{
   	 alert("浏览器不支持localStorage存储!");
   }
}
/*
* 删除 localStorage 内容
* @Param key
*/
export const delInLocalStorage=(key)=>{
   if(window.localStorage){
     window.localStorage.removeItem(key);
   }else{

   }
}

/*
* 获取localStorage的
* @Param key
*/
export const getInLocalStorage=(key)=>{
	let result="";
	if(window.localStorage){
        result=window.localStorage.getItem(key);
        try{
          result=JSON.parse(result);
        }catch(e){
          result=result;
        }
	}else{

	}
	return result;
}


