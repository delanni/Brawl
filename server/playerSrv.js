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
	var character = options.character;
    var score = 0;

    var updateFrom = function(player) {
        id = player.i || player.getId();
        name = player.n || player.getName();
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

	// getters
	
    var getId = function() {
            return id;
    };

    var getName = function() {
            return name;
    };

    var getPosition = function() {
            return position;
        };

    var getScore = function() {
            return score;
    };
	
	var getCharacter = function () {
		return character;
	};
	
	// setters

	var setPosition  = function(pos) {
		position = {
			x: pos.x,
			y: pos.y
		};
    };
	
	var setScore = function (newScore) {
		score = newScore;
	};

    return {
        // Publics
        getId: getId,
        getName: getName,
        getPosition: getPosition,
        getScore: getScore,
		getCharacter: getCharacter,
		
        updateFrom: updateFrom,
        
		setPosition: setPosition,
		setScore: setScore
    }
}

module.exports = Player;
