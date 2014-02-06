var C = require("./constants");
var FireBase = require("firebase");
var FirebaseTokenGenerator = require("firebase-token-generator");


function Multiplayer (gameModel, gameServer) {
	var userStore = {}, erotSresu = {};
	var waitQueue = [];
	
	var firebase = new FireBase('https://sphnxyag.firebaseio.com/players');
	var tokenGenerator = new FirebaseTokenGenerator('lZTvkcTz3VnlrYFK83CQ2mX0vSQ6T8yQxXAIkFjv');
	
	var heartBeat = function() {
	
		var players = gameModel.getPlayers();
		if (!players || Object.keys(players) == 0)
			return false;
		
		for (var i in players) {
			if (!players.hasOwnProperty(i)) 
				continue;
		
			var x = players[i].getPosition().x;
			var y = players[i].getPosition().y;
			
			// bounding box calculation
			var minX = Math.max(0, x - C.viewPortWidth * C.viewPortVisibilityFactor);
			var maxX = Math.min(C.gameAreaWidth, x + C.viewPortWidth * C.viewPortVisibilityFactor);
			var minY = Math.max(0, y - C.viewPortHeight * C.viewPortVisibilityFactor);
			var maxY = Math.min(C.gameAreaHeight, y + C.viewPortHeight * C.viewPortVisibilityFactor);
			
			var payload = Object.filter(players, function (pl) {
				   return pl.getPosition().x >= minX && pl.getPosition().x <= maxX &&
					pl.getPosition().y >= minY && pl.getPosition().y <= maxY;
				})
				.map(function (pl) {
					return {
						i: pl.getId(),
						p: pl.getPosition(),
						c: pl.getCharacter()
					};
				});
			
			var socket = erotSresu[players[i].getId()];
			
			if (socket) {
				gameServer.sendDataSingle(socket, 'x', {
					time: Date.now(),
					players: payload
				});
			}
		}
	};
	
	var refreshOverlay = function () {
		var players = gameModel.getPlayers();
		
		if (!players || Object.keys(players).length == 0)
			return false;
		
		var	payload = Object.map(players, function (pl) {
			return {
				id: pl.getId(),
				character: pl.getCharacter(),
				name: pl.getName(),
				score: pl.getScore()
			};			
		});
		
		if (payload && payload.length > 0) {
			firebase.set(payload, function (error) {
				if (error) {
					console.log('An error has occured during the overlayRefresh', error);
				}
			});
		}
	};
	
	var addNewPlayerSocket = function (playerSocket) {
		userStore[playerSocket.socket.__id] = playerSocket.player.getId();
		erotSresu[playerSocket.player.getId()] = playerSocket.socket;
		
		console.log('New player-socket mapping added to: ' + playerSocket.player.getId());
	};
	
	var removePlayer = function (userId) {
		gameModel.removePlayer(userId);
		
		if (waitQueue.length > 0) {
			// if any waiter
			var newPalyer = waitQueue.shift();
			gameModel.addPlayer(newPalyer.player);
			addNewPlayerSocket(newPalyer);
			newPalyer.socket.emit('yourIn', true);
			
			console.log('New player from waitqueue... playerId: ' + newPalyer.player.getId());
			
		} else if (gameModel.getPlayersCount() == 0) {
			// if the last user left, unauth firebase
		
			firebase.remove();
			firebase.unauth();
		}
		
		console.log(userId + ' has left');
	};
	
	var handleClientDisconnect = function(userId) {
		userId = userStore[this.__id];
        if (userId){
            console.log(userStore);
            removePlayer(userId);
        }
	};
	
	var kickPlayer = function(userId, socket) {
		socket.emit("disconnect", {
			reason: "fak u. no cheat!"
		});
		
		// remove player as well
		removePlayer(userId);
	};

	var validateData = function(userId, data) {
		if (data && data.me && data.me.i == userId) return true;
		return false;
	};
	
	var positionChangedHandler = function(data) {
		var socket = this;
		var socketId = socket.__id; // socket's unique id
		var userId = userStore[socketId]; // lookup the user
		
		if (validateData(userId, data))
			gameModel.updatePlayer(data.me);
		else // if chance of cheating
			kickPlayer(userId, socket);
	};
	
	var connectAndCallback = function(socket) {
		socket.__id = Date.now() * (Math.random() * 91) | 0;
		console.log("connection from: " + socket.__id);
		socket.on("getMeIn", function(player, fn) {
		
			console.log('getMeIn message from: ' + player.name);
			
            if (userStore[socket.__id])
                removePlayer(userStore[socket.__id]);
			
			var playersCount = gameModel.getPlayersCount();
			player = gameModel.connect(player.name, player.character);
			
			console.log(gameModel.getPlayersCount() + ' ' + C.maxPlayerCount);
			
			if (playersCount < C.maxPlayerCount) {
			
				// can enter the game
				addNewPlayerSocket({ socket: socket, player: player });
				
				// authenticate firebase if the first user has come
				if (gameModel.getPlayersCount() == 1) { 
					var token = tokenGenerator.createToken({ ivy: 'madison' });
					firebase.auth(token, function(error) {
					  if (error)
						console.log("Login failed to firebase!", error);
					  else
						console.log("Login succeeded to firebase!");
					});
				}
				
				console.log(player.getName() + " authenticated for " + player.getId());
				
				fn({ 
					access: true, 
					playerId: player.getId() 
				});
				
			} else {
				console.log(player.getName() + ' added or updated in waitqueue ' + player.getId());
				
				// player has to wait
				if (!waitQueue.any(function(item) { return item.socket.__id == socket.__id; })) {
					waitQueue.push({ socket: socket, player: player });
				}
					
				fn({ 
					access: false,
					playerId: player.getId()
				});
			}
		});
		
		// x: inputs
		socket.on('x', positionChangedHandler);
	};

	
	return {
		heartBeat: heartBeat,
		refreshOverlay: refreshOverlay,
		connectAndCallback: connectAndCallback,
		handleClientDisconnect: handleClientDisconnect
	};
}

module.exports = Multiplayer;