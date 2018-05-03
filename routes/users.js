var express = require('express');
var https = require('https');
var router = express.Router();
var User = require('../models/user');
require('./../util/util');
var dateCount = require('./../util/time');
var iconv = require("iconv-lite");  

router.post('/addUser', function(req, res, next) {//新建用户
	let appid = req.body.appid;
	let secret = '6a3a18a70982c743bdcf975451b45c8d';
	let js_code = req.body.js_code;
	let grant_type = 'authorization_code';
	let openid = ''
	https.get('https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&js_code='+js_code+'&grant_type='+grant_type, function (response) {
        var datas = [];  
        var size = 0; 
        response.on('data', function (data) {  
        	datas.push(data);  
            size += data.length; 
        });  
        response.on("end", function () {  
	 		var buff = Buffer.concat(datas, size);  
            var result = iconv.decode(buff, "utf8"); //转码//var result = buff.toString();//不需要转编码,直接tostring  
            openid = JSON.parse(result).openid;
			var platform = '007'
		    var r1 = Math.floor(Math.random()*10);
		    var r2 = Math.floor(Math.random()*10);
		    var sysDate = new Date().Format('yyyyMMddhhmmss');
		    var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
		    var userId = platform+r1+sysDate+r2;
		  	var user = {
		  		"openid": openid,
		  		"avatarUrl": req.body.avatarUrl,
			    "userId": userId,
				"nickName": req.body.nickName,
				"createTime": createDate,
				"status": 0,
				"gender": req.body.gender,
				"country": req.body.country,
				"province": req.body.province,
				"city": req.body.city,
				"periodCycle": 30,
				"periodLeft": 25,
				"periodStart": '',
				"periodEnd": '',
				"periodStartLately": '',
				"periodEndLately": '',
				"history": []
			}
			var userInsert = new User(user);
			userInsert.save(function(err1, doc){
			    if(err1){
			        res.json({
			            status: '0',
			            msg: err1.message,
			            result: ''
			        })
			    }else{
			        if(doc){
			            res.cookie('userId', userId,{
			                path: '/',
			                maxAge: 1000*60*60*24*365
			            })
			            res.json({
			                status: '1',
			                msg: '',
			                result: userId
			            })
			        }
			    }
			})
        });
    });
});

router.post('/getUserInfo', function(req, res, next) {//获取用户
	let userId = req.body.userId;
	User.findOne({
    	userId: userId
    },function(err,userDoc){
        if(err){
            res.json({
                status: '0',
                msg: err.message,
                result: ''
            })
        }else{
            if(userDoc){
                res.json({
                    status: '1',
                    msg: '',
                    result: userDoc
                })
            }else{
            	res.json({
	                status: '1',
	                msg: '未找到用户',
	                result: ''
	            })
            }
        }
    })
})

//增加姨妈到访时间，修改状态
router.post('/periodStart', function(req, res, next) {
	let userId = req.body.userId;
	User.findOne({
      userId: userId
    },function(err,user){
      	if(err){
	        res.json({
	          status: '0',
	          msg: err.message,
	          result: ''
	        })
      	}else{
	      	if(user){
		      	user.status = 1;
		      	user.periodStart = req.body.periodStart;
		      	if(user.periodStartLately == ''){
		      		user.periodStartLately = req.body.periodStart;
		      	}else{
		      		user.periodStartLately = dateCount.compareDate(req.body.periodStart,user.periodStartLately)?user.periodStartLately:req.body.periodStart;
		      	}
		      	user.periodEndLately = dateCount.dateAfter(user.periodStartLately,4);
		      	user.save(function(err1,saveDoc){
					if(err1){
			  			res.json({
			  				status: '0',
								msg: err1.message,
								result: ''
			  			})
			  		}else{
			  			res.json({
			  				status: '1',
							msg: '',
							result: 'success'
			  			})
			  		}
			  	})
	      	}else{
	        	res.json({
	                status: '1',
	                msg: '未找到用户',
	                result: ''
	            })
	        }
	    }
    })
})

//增加姨妈离开时间，修改状态
router.post('/periodEnd', function(req, res, next) {
	let userId = req.body.userId;
	User.findOne({
      userId: userId
    },function(err,userDoc){
      	if(err){
	        res.json({
	          status: '0',
	          msg: err.message,
	          result: ''
	        })
      	}else{
	        if(userDoc){
	        	userDoc.status = 0;
	        	userDoc.periodEnd = req.body.periodEnd;
				if(userDoc.periodEndLately == ''){
		      		userDoc.periodEndLately = req.body.periodEnd;
		      	}else{
		      		userDoc.periodEndLately = dateCount.compareDate(req.body.periodEnd,userDoc.periodEndLately)?userDoc.periodEndLately:req.body.periodEnd;
		      	}
	            userDoc.history.push({
	            	start: userDoc.periodStart,
					end: req.body.periodEnd,
					days: dateCount.dateDiff(userDoc.periodStart,req.body.periodEnd)
	            })
	            userDoc.save(function(err1,saveDoc){
	  				if(err1){
			  			res.json({
			  				status: '0',
	  						msg: err1.message,
	  						result: ''
			  			})
			  		}else{
			  			res.json({
			  				status: '1',
	  						msg: '',
	  						result: 'success'
			  			})
			  		}
	  			})
	        }else{
	        	res.json({
	                status: '1',
	                msg: '未找到用户',
	                result: ''
	            })
	        }
	    }
    })
})

//修改生理期
router.post('/editPeriodCycle', function(req, res, next) {
	let userId = req.body.userId;
	User.update({
      userId: userId
    },{
      periodCycle: req.body.periodCycle
    },function(err,user){
      if(err){
        res.json({
          status: '0',
          msg: err.message,
          result: ''
        })
      }else{
        res.json({
          status: '1',
          msg: '',
          result: 'success'
        })
      }
    })
})

//增加历史记录
router.post('/addHistory', function(req, res, next) {
	let userId = req.body.userId;
	let start = req.body.start;
	let end = req.body.end;
	User.findOne({
      userId: userId
    },function(err,userDoc){
      	if(err){
	        res.json({
	          status: '0',
	          msg: err.message,
	          result: ''
	        })
      	}else{
	        if(userDoc){
	            userDoc.history.push({
	            	start: start,
					end: end,
					days: dateCount.dateDiff(start,end)+1
	            })
	            if(userDoc.periodStartLately == ''){
		      		userDoc.periodStartLately = req.body.start;
		      	}else{
		      		userDoc.periodStartLately = dateCount.compareDate(req.body.start,userDoc.periodStartLately)?userDoc.periodStartLately:req.body.start;
		      	}
		      	if(userDoc.periodEndLately == ''){
		      		userDoc.periodEndLately = req.body.end;
		      	}else{
		      		userDoc.periodEndLately = dateCount.compareDate(req.body.end,userDoc.periodEndLately)?userDoc.periodEndLately:req.body.end;
		      	}
	            userDoc.save(function(err1,saveDoc){
	  				if(err1){
			  			res.json({
			  				status: '0',
	  						msg: err1.message,
	  						result: ''
			  			})
			  		}else{
			  			res.json({
			  				status: '1',
	  						msg: '',
	  						result: 'success'
			  			})
			  		}
	  			})
	        }else{
	        	res.json({
	                status: '1',
	                msg: '未找到用户',
	                result: ''
	            })
	        }
	    }
    })
})

router.post('/updateHistory', function(req, res, next) { //更新历史记录
	let userId = req.body.userId;
	let start = req.body.start;
	let end = req.body.end;
	let historyId = req.body.historyId;
	User.findOne({
      "userId": userId,
    },function(err,userDoc){
      	if(err){
	        res.json({
	          status: '0',
	          msg: err.message,
	          result: ''
	        })
      	}else{
	        if(userDoc){
	            userDoc.history.forEach(function(item){
	            	if(item._id == historyId){
	            		item.start = start,
						item.end = end,
						item.days = dateCount.dateDiff(start,end)+1
	            	}
	            })
		      	userDoc.periodStartLately = dateCount.compareDate(start,userDoc.periodStartLately)?userDoc.periodStartLately:start;
		      	userDoc.periodEndLately = dateCount.compareDate(end,userDoc.periodEndLately)?userDoc.periodEndLately:end;
	            userDoc.save(function(err1,saveDoc){
	  				if(err1){
			  			res.json({
			  				status: '0',
	  						msg: err1.message,
	  						result: ''
			  			})
			  		}else{
			  			res.json({
			  				status: '1',
	  						msg: '',
	  						result: 'success'
			  			})
			  		}
	  			})
	        }else{
	        	res.json({
	                status: '1',
	                msg: '未找到用户',
	                result: ''
	            })
	        }
	    }
    })
})
router.post('/deleteHistory', function(req, res, next) { //删除历史记录
	let userId = req.cookies.userId;
    let historyId = req.body.historyId;
    User.findOne({
      userId: userId,
    },function(err,userDoc){
    	if(err){
	        res.json({
	          	status: '0',
	          	msg: err.message,
	          	result: ''
	        })
     	}else{
     		if(userDoc){
     			userDoc.history.forEach(function(item){
     				if(item._id == historyId){
     					userDoc.history.splice(item,1);
     				}
			    	if(userDoc.history.length == 0){
			    		userDoc.periodStartLately = userDoc.status == 1? userDoc.periodStart:'';
			    		userDoc.periodEndLately = userDoc.periodStartLately != '' ? dateCount.dateAfter(userDoc.periodStartLately,4): '';
			    	}
			    	userDoc.save(function(err1,user){
				      	if(err){
					        res.json({
					          	status: '0',
					          	msg: err.message,
					          	result: ''
					        })
				     	}else{
					        res.json({
					          	status: '1',
					          	msg: '',
					          	result: 'success'
					        })
				      	}
			    	})
     			})
     		}else{
     			res.json({
		          	status: '0',
		          	msg: '没有找到用户',
		          	result: ''
		        })
     		}
      	}
    })
})
module.exports = router;








