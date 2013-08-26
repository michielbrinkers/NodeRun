require('./utils/utils');

var test = process.argv[2];

switch ( test )
{
	case "timeout":
		setTimeout(function(){	console.log("timeout");}, 1000);
		break;

	case "error":
		setTimeout(function(){	throw "error"; }, 1000);
		break;

	case "interval":
	default:
		setInterval(function(){	console.log("interval");}, 1000);
		break;
}
