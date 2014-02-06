function runExpress(port){

	/**
	 * Module dependencies.
	 */

	// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
	require('nko')('l5bEWe5HKF9UfAbg');

	var express = require('express');
	var routes = require('./routes');
	var user = require('./routes/user');
	var http = require('http');
	var path = require('path');

	var app = express();

	// if run as root, downgrade to the owner of this file
	try{
		if (process.getuid() === 0) {
		require('fs').stat(__filename, function(err, stats) {
		  if (err) { return console.error(err); }
		  process.setuid(stats.uid);
		});
	}
	} catch(e){
		// there was no setuid and getuid in windows
	}

	// all environments
	app.set('port', port);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

	app.get('/', routes.index);
	app.get('/users', user.list);

	http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});

}

module.exports = runExpress;