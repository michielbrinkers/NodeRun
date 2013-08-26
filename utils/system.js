var fs = require('fs');
var spawn = module.require('child_process').spawn;

module.exports = new function()
{
	var executionTimes = {};

	var spawnProcess = function(params)
	{
		var proc = spawn(params.cmd, params.params, params.options);

		if ( params.onspawn )
			params.onspawn.call(this, proc);

		var stdout = "";
		var stderr = "";

		proc.stdout.on('data', function(data){
			stdout += data + "\n";
			if ( params.onstdout ) params.onstdout.call(this, data);
		});

		proc.stderr.on('data', function(data){
			stderr += data + "\n";
			if ( params.onstderr ) params.onstderr.call(this, data);
		});

		proc.on('exit', function(code, signal){
			if ( code === 0 )
			{
				params.onsuccess.call(this, stdout);
			}
			else
			{
				params.onfailure.call(this, code, signal, stderr, stdout);
			}
		});
	};

	/**
	 * @param params.cmd
	 * @param params.params
	 * @param params.deltaTime minumum time between calls to the same command
	 * @param params.options
	 * @param params.onsuccess (_stdout)
	 * @param params.onfailure (_code, _stderr)
	 * @param params.onspawn (_process)
	 * @param params.onstdout (_data)
	 * @param params.onstderr (_data)
	 */
	this.run = function(params)
	{
		params.deltaTime = params.deltaTime || 0;

		var time = executionTimes[params.cmd] || 0;
		var now = Date.now();
		if ( params.deltaTime == 0 || time == 0 )
		{
			executionTimes[params.cmd] = now;
			spawnProcess(params);
		}
		else
		{
			var diff = now - time;
			if ( diff > params.deltaTime )
			{
				// Execute right away
				executionTimes[params.cmd] = now;
				spawnProcess(params);
			}
			else
			{
				// Delay execution
				var next = time + params.deltaTime;
				executionTimes[params.cmd] = next;
				var timeout = next - now;
				setTimeout(function(){
					spawnProcess(params);
				}, timeout);
			}
		}
	};

	this.isRunning = function(params)
	{
		var scope = params.scope || this;
		spawnProcess({
			cmd: "tasklist",
			params: ["/FI", "IMAGENAME eq " + params.process],
			onsuccess: function(stdout){
				if (stdout.indexOf(params.process) != -1 )
				{
					params.onsuccess.call(scope, true);
				}
				else
				{
					params.onsuccess.call(scope, false);
				}
			},
			onfailure: params.onfailure
		});
	};
};
