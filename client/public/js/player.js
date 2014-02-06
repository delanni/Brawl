function Player(options) {
    options = options || {
        id: 'unnamed' + Date.now(),
        name: "unnamed",
        character: 0,
        position: {
            x: 0,
            y: 0
        }
    };

    // Privates
    var id = options.id || options.i;
    var name = options.name || options.n;
    var position = options.position || options.p;
    var character = options.character || options.c;
    var score = options.score || options.s;
    var ready;
    var body;
    var sprite;

    var goLeft = function () {
        body.ApplyForce({x: 20, y: 0});
    };
    var goRight = function () {
        body.ApplyForce({x: -20, y: 0});
    };
    var jump = function () {
        body.ApplyForce({x: 0, y: -300});
    };

    var progress = function (time) {
        body.Step(time);
        position = body.GetPosition();
        sprite.position.x = position.x;
        sprite.position.y = position.y;
    };

    var updateFrom = function (player) {
        id = player.i || player.getId();
        character = player.c || player.getCharacter();
        if (player.getPosition) {
            position.x = player.getPosition().x;
            position.y = player.getPosition().y;
        }
        else if (player.p) {
            position.x = player.p.x;
            position.y = player.p.y;
        }
        score = player.score;
    };

    var getTransport = function () {
        return {
            i: id,
            n: name,
            p: position,
            s: score,
            c: character
        };
    };

    var getId = function () {
        return id;
    };

    var getName = function () {
        return name;
    };

    var getPosition = function () {
        return position;
    };

    var setPosition = function (pos) {
        position = {
            x: pos.x,
            y: pos.y
        };
    };

    var getScore = function () {
        return score;
    };

    var setBody = function (b) {
        //player box2d
        body = b;
    };

    var setSprite = function (s) {
        sprite = s;
    };

    var init = function () {
    };

    var isReady = function () {
        return ready;
    };

    var getCharacter = function () {
        return character;
    };

    var getBody = function () {
        return body;
    };

    var getSprite = function () {
        return sprite;
    };

    var setReady = function (a) {
        ready = a || true;
    };

    return {
        // Publics
        getId: getId,
        getName: getName,
        getPosition: getPosition,
        setPosition: setPosition,
        getScore: getScore,
        getCharacter: getCharacter,
        updateFrom: updateFrom,
        getTransport: getTransport,
        init: init,
        isReady: isReady,
        setReady: setReady,
        getBody: getBody,
        setSprite: setSprite,
        setBody: setBody,
        getSprite: getSprite,
        progress: progress,
        goLeft: goLeft,
        goRight: goRight,
        jump: jump
    }
}

module.exports = Player;
