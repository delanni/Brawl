function runserver(port){
	var IO = require("./ioServer");
	var GameModel = require("./gameModelSrv");
	var MultiPlayer = require("./multiplayer");
	require("./util")();

	var gameModel = new GameModel();
	var gameServer = new IO({
	    port: port,
	    loglevel: 1
	});

	var multi = new MultiPlayer(gameModel, gameServer);
	setInterval(multi.heartBeat, 100);
	setInterval(multi.refreshOverlay, 1000);

	gameServer.init()
		.onNewConnection(multi.connectAndCallback)
		.onConnectionClose(multi.handleClientDisconnect)
		.live("kaka", function(data) {
			console.log(data);
	});

	gameServer.connect();
}

module.exports = runserver;