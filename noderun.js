console.log("-------");
console.log("NodeRun");
console.log("-------");

var fs = require('fs'),
	system = require('./utils/system');

if ( process.argv.length <= 2 )
{
	console.log("NodeRun:: please specify which script to run");
	process.exit();
}

// Get script to run
var script = process.argv[2];

// Add .js if not there
if ( !/\.js$/.test(script) )
{
	script += ".js";
}

// Check if script exists
if ( !fs.existsSync(script) )
{
	console.log("NodeRun:: could not find: " + script);
	process.exit();
}

function start(){
	console.log("NodeRun:: starting:", script);
	system.run({
		cmd: "node",
		params: process.argv.slice(2),
		options: {detached: true},
		onsuccess: function(stdout){
			console.log("NodeRun:: process exited expectedly.");
			console.log("NodeRun:: restarting");
			setTimeout(start, 1000);
		},
		onfailure: function(code, signal, stderr){
			console.log("NodeRun:: process exited unexpectedly with error code", code);
			if ( stderr ) console.log(stderr);
			console.log("NodeRun:: restarting");
			setTimeout(start, 1000);
		},
		onstdout: function(data){
			console.log(data.toString().replace(/\r?\n?$/, ""));
		}
	});
}
start();