var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	"avatarUrl": String,
	"userId": String,
	"openid": String,
	"nickName": String,
	"createTime": String,
	"status": Number,//0为正常，1为亲戚来了
	"gender": Number,//0为女，1为男
	"country": String,
	"province": String,
	"city": String,
	"periodCycle": Number,
	"periodLeft": Number,
	"periodStart": String,
	"periodEnd": String,
	"periodStartLately": String,
	"periodEndLately": String,
	"history": [{
		"start": String,
		"end": String,
		"days": Number
	}]
})
module.exports = mongoose.model('user',userSchema);