function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式  
   	var  aDate,  oDate1,  oDate2,  iDays  
   	aDate  =  sDate1.split("-")  
    aDate[1] = aDate[1].length == 1 ? '0' + aDate[1] : aDate[1];
    aDate[2] = aDate[2].length == 1 ? '0' + aDate[2] : aDate[2];
   	oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2002格式  
   	aDate  =  sDate2.split("-")  
    aDate[1] = aDate[1].length == 1 ? '0' + aDate[1] : aDate[1];
    aDate[2] = aDate[2].length == 1 ? '0' + aDate[2] : aDate[2];
   	oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  
   	iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
   	return  iDays + 1
}

function dateAfter(date,days){
	var  startDate  =  new  Date  (date);
	var  intValue  =  0;  
	var  endDate  =  null;  

	intValue  =  startDate.getTime();            
	intValue  +=  days  *  (24  *  3600  *  1000);
	endDate  =  new  Date  (intValue);  
  var year = endDate.getFullYear();
  var month = (endDate.getMonth()+1)<10 ? '0'+(endDate.getMonth()+1) : (endDate.getMonth()+1);
  var day = endDate.getDate() < 10 ? '0'+endDate.getDate() : endDate.getDate();
	return year+"-"+ month+"-"+ day;  
}

function compareDate(t1, t2){
    var strs1= new Array(); //定义一数组
    strs1=t1.split("-"); //字符分割
    var strs2= new Array(); //定义一数组
    strs2=t2.split("-"); //字符分割
    if (strs1[2].length == 1) {
      strs1[2] = '0' + strs1[2];
    }
    if (strs2[2].length == 1) {
      strs2[2] = '0' + strs2[2];
    }
    if(parseInt(strs1[0])> parseInt(strs2[0])) { return false; }
    else if(parseInt(strs1[0]) <parseInt( strs2[0])) { return true; }
    else{}
    if(parseInt(strs1[1] )> parseInt(strs2[1])) { return false; }
    else if(parseInt(strs1[1]) <parseInt( strs2[1])) { return true; }
    else{}
    if (parseInt(strs1[2]) > parseInt(strs2[2])) { return false; }
    else if (parseInt(strs1[2]) <= parseInt(strs2[2])) { return true; }
    else{}
    return true;
}
module.exports = {
	dateDiff: DateDiff,
	dateAfter: dateAfter,
	compareDate: compareDate
}