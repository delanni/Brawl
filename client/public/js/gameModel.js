var Player = require("./player");
var Body = require("./Body");
//require('./util.js')();

var C = require("./constants");

function GameModel(options) {
    options = options || {};
    // Privates
    var players = {};
    var myId;
    var myName;

    var world = [];
    var playerBodies = {};

    // functions
    var init = function () {

        // create ground
        var floor = new Body({
            position: {
                x: -40,
                y: C.gameAreaHeight - 11
            },
            width: 8000,
            height: 200
        });

        var leftWall = new Body({
            position: {
                x: -1000,
                y: 0
            },
            width: 1000,
            height: C.gameAreaHeight * 2
        });

        var rightWall = new Body({
            position: {
                x: C.gameAreaWidth,
                y: 0
            },
            width: 1000,
            height: C.gameAreaHeight * 2
        });

        world.push(leftWall);
        world.push(rightWall);
        world.push(floor);
    };

    function createBodyOn(p) {
        var body = new Body({
            position: {x: p.getPosition().x, y: p.getPosition().y},
            width: 80, height: 100
        });
        p.setBody(body);
    }

    function movePlayer(KEY_STATUS) {
        if (KEY_STATUS.left) {
            getOwnPlayer().goRight();
        } else if (KEY_STATUS.right) {
            getOwnPlayer().goLeft();
        } else if (KEY_STATUS.up) {
            getOwnPlayer().jump();
        }
    }

    var addPlayer = function (p) {
        players[p.id || p.getId()] = p;
        playerBodies[p.id || p.getId()] = p.getBody();
    };

    var removePlayer = function (p) {
        var id = p.hasOwnProperty("id") ? p.id : p;
        delete playerBodies[id];
        delete players[id];
    };

    var progress = function (time) {
        for (var p in players) {
            if (players.hasOwnProperty(p)) {
                p = players[p];
                if (p.isReady())
                    p.progress(time);
            }
        }

        for (var i in players) {
            if (players.hasOwnProperty(i) && players[i].getCharacter())  var player = players[i];
            else continue;
            if (player.isReady()) {

            }
        }

        var lastCollision;
        // collide bodies
        for (var p1 in playerBodies) {
            if (!playerBodies.hasOwnProperty(p1)) continue;
            p1 = playerBodies[p1];
            for (var p2 in playerBodies) {
                if (!playerBodies.hasOwnProperty(p2)) continue;
                p2 = playerBodies[p2];
                if (p1 == p2) continue;
                if (lastCollision = p1.Collides(p2)) {
                    if (lastCollision == "bottom") {
                        kill(p1, p2);
                    }
                }
            }
        }

        for (var pxx in playerBodies) {
            if (!playerBodies.hasOwnProperty(pxx)) continue;
            pxx = playerBodies[pxx];
            for (i = 0; i < world.length; i++) {
                if (lastCollision = pxx.Collides(world[i])) {
                    switch (lastCollision) {
                        case "left":
                            pxx.SetLeft(world[i].GetRight());
                            break;
                        case "right":
                            pxx.SetRight(world[i].GetLeft());
                            break;
                        case "top":
                            pxx.SetTop(world[i].GetBottom());
                            break;
                        case "bottom":
                            pxx.SetBottom(world[i].GetTop());
                            break;
                    }
                }
            }
        }
    };

    var getPlayer = function (id) {
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
        } else if (id.i) {
            return players[id.i];
        }
    };

    var getPlayers = function () {
        return players;
    };

    var getPlayerTransports = function () {
        return Object.map(players, function (pl) {
            return pl.getTransport();
        });
    };

    var updatePlayer = function (player) {
        getPlayer(player).updateFrom(player);
    };

    var getOwnPlayer = function () {
        return players[myId];
    };

    return {
        // Publics
        getMyId: function () {
            return myId;
        },
        setMyId: function (id) {
            myId = id;
        },
        getMyName: function () {
            return myName;
        },
        setMyName: function (name) {
            myName = name;
        },
        createBodyOn: createBodyOn,
        init: init,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        progress: progress,
        getPlayers: getPlayers,
        getPlayer: getPlayer,
        getPlayerTransports: getPlayerTransports,
        getOwnPlayer: getOwnPlayer,
        updatePlayer: updatePlayer,
        world: world,
        movePlayer: movePlayer
    }
}

module.exports = GameModel;