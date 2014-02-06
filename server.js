var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = process.env.PORT || (isProduction ? 80 : 8000);
var child_process = require("child_process");
var util = require("util");

var runServer = require("./server/main.js");
var runExpress = require("./client/app.js");

util.print("Building bundle...");

var bundleCommand = (process.platform == "win32") ? "call client\\makeBundle2.bat":  "/home/deploy/current/client/makeBundle.sh";
child_process.exec(bundleCommand,function (error, stdout, stderr) {
    if (error !== null) {
    	console.log("failed.");
        console.log('exec error: ' + error);
    } else {
    	console.log("done.");
	    console.log(stdout.toString());
		console.log("Starting EXPRESS on:" + port);
		setTimeout(function(){
			runExpress(port);
		},0);

		console.log("Starting IOServer on:" + 1133);
		setTimeout(function(){
			runServer(1133);
		},0);

    }
});
