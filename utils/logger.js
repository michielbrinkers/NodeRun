var fs = require('fs'),
	path = require("path");

module.exports = function(script){

	if ( !fs.existsSync(".logs") )
	{
		fs.mkdirSync(".logs", 777);
	}

	var pad = function(value, length){
		value = value.toString();
		while(value.length<length) value = "0" + value;
		return value;
	};

	var date = new Date();
	date = date.getFullYear() + "-" + pad(date.getMonth()+1,2) + "-" + pad(date.getDate(),2) + "-" + pad(date.getHours(),2) + "." + pad(date.getMinutes(),2) + "." + pad(date.getSeconds(),2) + "." + pad(date.getMilliseconds(), 3);
	var file = ".logs/" + date + "_log_" + script + ".log";
	console.log("Logger:: logging to " + file);

	this.log = function(data){
		var str = data.toString();
		if (str.indexOf("NODERUN::") != -1 )
		{
			console.log(str.substring(str.indexOf("NODERUN::")+9));
		}

		fs.appendFile(file, data, function (error) {
			if (error) throw error;
		});
	};
};