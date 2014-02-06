var GameModel = require("./gameModel");
var GameUI = require("./gameUI");
var C = require("./constants");
var Player = require("./player");

// Privates
function Game(options) {
    options = options || {};
    // Shimmitiy shim shim
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    var KEY_CODES = {
        37: 'left',
        38: 'up',
        39: 'right'
    };

    var KEY_STATUS = {};

    window.addEventListener('keydown', function (e) {
        var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
        if (KEY_CODES[keyCode]) {
            e.preventDefault();
            KEY_STATUS[KEY_CODES[keyCode]] = true;
        }
    });

    window.addEventListener('keyup', function(e) {
        var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
        if (KEY_CODES[keyCode]) {
            e.preventDefault();
            KEY_STATUS[KEY_CODES[keyCode]] = false;
        }
    });

    var box2d = {
        b2Vec2 : Box2D.Common.Math.b2Vec2,
        b2BodyDef : Box2D.Dynamics.b2BodyDef,
        b2Body : Box2D.Dynamics.b2Body,
        b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
        b2Fixture : Box2D.Dynamics.b2Fixture,
        b2World : Box2D.Dynamics.b2World,
        b2MassData : Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw : Box2D.Dynamics.b2DebugDraw
    };

    var ioModel = options.ioModel;
    var model = new GameModel({
        box2d: box2d,
        canvasHeight: C.viewPortHeight
    });
    var ui = new GameUI({
        gameModel: model,
        box2d: box2d,
        canvasId: options.canvasId,
        canvasWidth: C.viewPortWidth,
        canvasHeight: C.viewPortHeight
    });
    var requestAnimFrame = window.requestAnimFrame;
    var state = C.gameStates.NOTSTARTED;

    var init = function() {
        for (code in KEY_CODES) {
            KEY_STATUS[KEY_CODES[code]] = false;
        }

        ui.init();
        model.init();

        //(function attachIO(key) {
            ioModel.onData('x', updateModel);
        //})("x");
    };

    var lasttime;
    function progress(time) {
        if (state == C.gameStates.RUNNING) {
            if (!lasttime) lasttime = time;
            var elapsedTime = time-lasttime;
            lasttime = time;
            requestAnimFrame(progress);
            model.movePlayer(KEY_STATUS);
            // progress the model
            model.progress(elapsedTime);
            // render the stage
            ui.progress(elapsedTime);
            ui.render(elapsedTime);
        }
        else {
            requestAnimFrame(degrade);
        }
    }

    function degrade() {

    }

    var updateModel = function(data) {
        var createdPlayer; // data_player representant
        var existingPlayer; // model player representant
        var receivedPlayers = data.players; // players arrived in data
        for (var receivedPlayer_key in receivedPlayers) {
            if (!receivedPlayers.hasOwnProperty(receivedPlayer_key)) continue;

            var receivedPlayer =  receivedPlayers[receivedPlayer_key];
            existingPlayer = model.getPlayer(receivedPlayer);
            if (existingPlayer) {
                existingPlayer.updateFrom(receivedPlayer);
            }else {
                createdPlayer = new Player(receivedPlayer);
                createdPlayer.setPosition({x: 400, y:0});
                ui.createSpriteOn(createdPlayer);
                model.createBodyOn(createdPlayer);
                model.addPlayer(createdPlayer);
            }
        }
    };

    return {
        // Publics
        init: init,
        start: function() {
            state = C.gameStates.RUNNING;
            progress();
        },
        stop: function() {
            state = C.gameStates.ENDED;
        }, 
        setSelf: function(me){
            model.setMyName(me.name);
            model.setMyId(me.id);
        },
        connected: function() {

        }
    }
}

module.exports =  Game;