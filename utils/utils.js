///////////
// Utils //
///////////

var pad = function(value, length){
	value = value.toString();
	while(value.length<length) value = "0" + value;
	return value;
};

var log = console.log;
console.log = function(){
	var args = Array.prototype.slice.call(arguments);
	var date = new Date();
	args.unshift(pad(date.getHours(),2)+":"+pad(date.getMinutes(),2)+":"+pad(date.getSeconds(),2)+"."+pad(date.getMilliseconds(), 3));
	log.apply(this, args);
};

console.clear = function()
{
	process.stdout.write('\033[2J\033[0;0H');
};

exports.Is = Is = new function()
{
	this.defined = function(_obj)
	{
		return typeof _obj != "undefined";
	};

	this.object = function(_obj)
	{
		return typeof _obj == "object";
	};

	this.array = function(_obj)
	{
		return Object.prototype.toString.call(_obj) == '[object Array]';
	};

	this.func = function(_obj)
	{
		return typeof _obj == "function";
	};

	this.string = function(_obj)
	{
		return typeof _obj == "string";
	};
};
