var socketio = require("socket.io");

function IOServer(options) {
    options = options || {};

    var port = options.port;
    var connections = [];
    var connectionHandlers = [];

    var init = function() {
        connections.length = 0;
        connectionHandlers.length = 0;
        onHandlers.length = 0;

        return this;
    };

    var connect = function(p) {
        var listenPort = p || port || 1133;

        console.log("listening on " + listenPort);
        var io = socketio.listen(+listenPort);

        if(options.hasOwnProperty("loglevel")) {
            io.set('log level', options.loglevel);
        }

        io.sockets.on("connection", handleConnection);
        return this;
    };

    var handleConnection = function(socket) {
        console.log("added socket to list [" + connections.length + "]");
        connections.push(socket);

        for (var i = 0; i < onHandlers.length; i++) {
            socket.on(onHandlers[i][0], onHandlers[i][1]);
        }

        if (connectionHandlers.length == 1) connectionHandlers[0](socket);
        else {
            for (i = 0; i < connectionHandlers.length; i++) {
                connectionHandlers[i](socket);
            }
        }

    };

    var onConnection = function(connectionHandler) {
        connectionHandlers.push(connectionHandler);
        return this;
    };

    var onConnectionDisconnect = function(disconnectHandler) {
        on("disconnect", disconnectHandler);
        return this;
    };

    var onHandlers = [];
    var on = function(key, handler) {
        for (var i = 0; i < connections.length; i++) {
            connections[i].on(key, handler);
        }
        onHandlers.push([key, handler]);
    };

    var sendData = function(target,key,data){
        if(typeof target == 'string') {
            data = key;
            key= target;
            target = connections;
        }
        if (target.hasOwnProperty("length")){
            for(var i = 0; i < target.length; i++){
                sendDataSingle(target[i],key,data);
            }
        } else {
            sendDataSingle(target,key,data);
        }
    };

    var sendDataSingle = function(target,key,data){
        target.emit(key, data);
    };

    return {
        init: init,
        connect: connect,
        onNewConnection: onConnection,
        connections: connections,
        onConnectionClose: onConnectionDisconnect,
        sendDataSingle: sendDataSingle,
        sendData: sendData,
        live: on
    }
}

module.exports = IOServer;