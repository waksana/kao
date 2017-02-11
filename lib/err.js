var format = require('util').format;
var util = require('util');

var Err = function(curValue, message, value){
	this.curValue = curValue;
	this.message = message;
	this.path = '';
	this.orTimes = 0;
	this.value = util.isNullOrUndefined(curValue) || curValue == '' ? value : curValue;
};

Err.prototype = Object.create(Error);

Err.prototype.inspect = function(){
	var curValue = this.curValue;
	var message = this.message;
	var path = this.path;
	this.path = '';
	this.curValue = '';
	if(util.isObject(curValue))
		curValue  = JSON.stringify(curValue);
	if(path !== '')
		return format('%s ==> %s %s', path, curValue, message);
	else
		return format("%s %s", curValue, message);
};

Err.prototype.key = function(key){
	this.path = format('%s', key);
	this.message = this.inspect();
	return this;
};

Err.prototype.index = function(idx){
	this.path = format('[%s]', idx);
	this.message = this.inspect();
	return this;
};
module.exports = Err;
