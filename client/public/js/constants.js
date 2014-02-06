console.log("Loading Constants file");
var C = C || {};

C.connectionStates = {
    OFFLINE: "OFFLINE",
    ONLINE: "ONLINE",
    CONNECTING: "CONNECTING"
};

C.gameStates = {
    RUNNING: "RUNNING",
    NOTSTARTED: "NOT STARTED",
    ENDED: "ENDED"
};

C.gameAreaWidth = 2400;
C.gameAreaHeight = 1800;

C.viewPortWidth = 800;
C.viewPortHeight = 600;

module.exports = C;
