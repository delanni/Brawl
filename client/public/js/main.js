console.log("Main file");

var PageModel = require("./pageModel");
var IOModel = require("./ioModel");
var Game = require("./game");

var DEV = true;

var SERVER_URL;
if (DEV) {
    SERVER_URL = "http://localhost";
} else {
    SERVER_URL = "http://madison-ivy.2013.nodeknockout.com";
}

(function () {
    var page = new PageModel({
        veilClass: "loadingVeil",
        waitingVeilClass: "waitingVeil",
        wrapperClass: "wrapper"
    });
    page.showLoadingVeil();
    var ioModel = new IOModel({
        url: SERVER_URL,
        port: 1133
    });
    var game = new Game({
        ioModel: ioModel,
        canvasId: "gameCanvas"
    });

    ioModel.onConnect(function () {
        console.log("connected");
    });

    ioModel.onDisconnect(function (message) {
        console.log("disconnected, reason: " + JSON.stringify(message));
    });

    ioModel.onStateChange(function (s) {
        console.log("state changed to " + s)
    });

    page.showLoadingVeil();
    $(document).ready(function(){
       page.removeLoadingVeil();
    });

    ioModel.connect();
    game.init();

    app.gameRef = {
        page: page,
        ioModel: ioModel,
        game: game
    }
})();