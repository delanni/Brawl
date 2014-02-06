var Player = require("./playerSrv");
var C = require("./constants");
require('./util.js')();


function GameModel(options) {
    options = options || {};
    // Privates
    var players = {};


    // functions
    var init = function() {
    };

    var addPlayer = function(p) {
        players[p.id || p.getId()] = p;
    };

    var connect = function(name, character) {
		var id = name + ((Math.random() * 1000) | 0);
		var player = new Player({
			id: id,
			name: name,
			character: character,
			position: { x: 0, y: 0 }
		});
		
		if (getPlayersCount() < C.maxPlayerCount)
			addPlayer(player);
		
		return player;
    };

    var removePlayer = function(p) {
		var id = p.hasOwnProperty("id") ? p.id : p;

		delete players[id];
    };

	var getPlayersCount = function () {
		return Object.keys(getPlayers()).length;
	};
	
    var progress = function(time){
    };

    var getPlayer = function(id) {
        if (typeof id == 'undefined') {
            for (var _i in players) {
                return players[_i];
            }
        }
        else if (typeof id == 'number' || typeof id == 'string') {
            return players[id];
        }
        else if (id.getId) {
            return getPlayer(id.getId());
        } else if (id.i){
            return players[id.i];
        }
    };

    var getPlayers = function() {
        return players;
    };

    var getPlayerTransports = function() {	
		return Object.map(players, function (pl) { return pl.getTransport(); });
    };

    var updatePlayer = function(player) {
           getPlayer(player).updateFrom(player);
    };
    
    return {
        // Publics
        init: init,
        addPlayer: addPlayer,
        connect: connect,
        removePlayer: removePlayer,
        progress: progress,
        getPlayers: getPlayers,
        getPlayer: getPlayer,
        getPlayerTransports: getPlayerTransports,
        updatePlayer: updatePlayer,
		getPlayersCount: getPlayersCount
    }
}

module.exports = GameModel;