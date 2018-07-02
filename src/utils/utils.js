

export const isEmpty=(str)=>{
  const emptyReg=/^\s*$/;
  if(emptyReg.test(str)){
    return true;
  }
  return false;
}

export const FilterMaxId=(list,columnName)=>{
    const temp=list && list[list.length-1];
    if(temp==undefined)return 1;
    if(columnName in temp)
      return parseInt(temp[columnName])+1;
    return 1;
}