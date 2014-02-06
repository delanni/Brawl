var C = require("./constants");

console.log("Loading IOModel class");

function IOModel(options) {
    options = options || {};
    // Privates
    var socket;
    var url = options.url || "http://localhost";
    var port = options.port;
    var state = C.connectionStates.OFFLINE;

    var stateChangeHandler;
    var connectHandlers = [];
    var disconnectHandlers = [];
    var errorHandlers = [];
    var dataHandlers = {};

    var connect = function() {
        onConnect(setOnline);
        onDisconnect(setOffline);

        socket = io.connect(url + (port? ":" + port:""));

        for (var i = 0; i < connectHandlers.length; i++) {
            socket.on("connect", connectHandlers[i]);
            socket.on("reconnect", connectHandlers[i]);
        }

        for (i = 0; i < disconnectHandlers.length; i++) {
            socket.on("disconnect", disconnectHandlers[i]);
        }

        for (i = 0; i < errorHandlers.length; i++) {
            socket.on("error", errorHandlers[i]);
        }

        for (i in dataHandlers) {
            var dataHandler = dataHandlers[i];
            for (var j = 0; j < dataHandler.length; j++) {
                socket.on(i, dataHandler[j]);
            }
        }
        onReconnecting(setProgressing);
        onFailure(setOffline);

        return this;
    };

    var disconnect = function() {
        socket.emit('disconnect', {});
        state = C.connectionStates.OFFLINE;
    };

    var onData = function(dataKey, dataHandler) {
        if (!dataHandlers[dataKey]) dataHandlers[dataKey] = [];
        dataHandlers[dataKey].push(dataHandler);
        if (socket) {
            socket.on(dataKey, dataHandler);
        }
        return this;
    };

    var onConnect = function(connectHandler) {
        connectHandlers.push(connectHandler);
        return this;
    };

    var onDisconnect = function(disconnectHandler) {
        disconnectHandlers.push(disconnectHandler);
        return this;
    };

    var onError = function(errorHandler) {
        errorHandlers.push(errorHandler);
        return this;
    };

    var onReconnecting = function(inProgressHandler) {
        socket.on('connecting', inProgressHandler);
        socket.on('reconnecting', inProgressHandler);
    };

    var onFailure = function(failureHandler) {
        socket.on('connect_failed', failureHandler);
        socket.on('reconnect_failed', failureHandler);
    };

    var setOnline = function() {
        if (state != (state = C.connectionStates.ONLINE)) {
            if (stateChangeHandler) stateChangeHandler(state);
        }
    };
    var setProgressing = function() {
        if (state != (state = C.connectionStates.CONNECTING)) {
            if (stateChangeHandler) stateChangeHandler(state);
        }
    };
    var setOffline = function() {
        if (state != (state = C.connectionStates.OFFLINE)) {
            if (stateChangeHandler) stateChangeHandler(state);
        }
    };

    var onStateChange = function(handler) {
            stateChangeHandler = handler;
     };

     var getSocket = function() {
            return socket;
    };

    var send = function(key, data) {
        socket.emit(key, data);
    };

    return {
        // Publics
        state: state,

        connect: connect,
        onConnect: onConnect,
        onDisconnect: onDisconnect,
        onData: onData,
        onError: onError,
        onStateChange: onStateChange,
        getSocket: getSocket,
        send: send
    }
}

module.exports = IOModel;