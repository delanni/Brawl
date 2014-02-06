/**
 * Created by Alex on 2013.11.09..
 */

var app = angular.module('animalbrawl', ['firebase']);

app.factory("Characters", function () {
    var Characters = {};
    Characters[0] = {
        "characterId": 0,
        "name": "Random",
        "class": "avatar0",
        "description": "You can be anyone you wish, why would you not chose? Well, if you won't, we will."
    };
    Characters[1] = {
        "characterId": 1,
        "name": "Chez",
        "class": "avatar5",
        "description": "Rabbit of Justine Bieber, Justin Bieber's sister. Never heard of her? Me neither."
    };
    Characters[2] = {
        "characterId": 2,
        "name": "Randolph",
        "class": "avatar1",
        "description": "Rudolph's cousin. Got kicked out of the 'crew' because of alcoholism."
    };
    Characters[3] = {
        "characterId": 3,
        "name": "Phil HOP.",
        "class": "avatar4",
        "description": "Honorary Oxford PhD, Phil Halters was once a pilot of an airship. He owns a car. Interesting stuff."
    };
    Characters[4] = {
        "characterId": 4,
        "name": "Gip",
        "class": "avatar3",
        "description": "Gip the pig. He doesn't like being called a politician."
    };
    Characters[5] = {
        "characterId": 5,
        "name": "Gwendolyne",
        "class": "avatar2",
        "description": "One damn ugly piece of a cat. Former colleague of Lady GaGa."
    };

    return Characters;
});

app.directive("avatar", function () {
    return {
        restrict: "E",
        template: "<div class='avatar'></div>",
        link: function (scope, element, attrs) {
            $(element).find(".avatar").addClass("avatar" + attrs.character);
        }
    }
});

app.controller("PlayersController", ['$scope', 'angularFire' , function ($scope, angularFire) {
    var playersRef = new Firebase('https://sphnxyag.firebaseio.com//players');
    $scope.players = angularFire(playersRef, $scope, 'players');
    $scope.upperHalf = function () {
        return Math.floor($scope.players.length / 2 + 0.001);
    };
    $scope.lowerHalf = function () {
        return $scope.players.length - $scope.upperHalf()
    };
    $scope.setMe = function(me){
        $scope.me = me;
    };
}
]);


app.controller("LoginController", ['$scope', "Characters", function ($scope, Characters) {
    var namePlaceHolder = "Your name here";

    $scope.characters = Characters;
    $scope.character = {};
    $scope.name = namePlaceHolder;
    $scope.edited = false;
    $scope.shown = false;
    $scope.setEdited = function () {
        $scope.edited = true;
        $scope.name = "";
    };
    $scope.send = function () {
        var r = (Math.random() * 5 | 0)+1;
        var c = $scope.character.characterId || r;
        var name = ($scope.name != namePlaceHolder && $scope.name != "") ? $scope.name :$scope.characters[c].name;
		var me = null;
		
        playerSelection = {
            character: c,
            name: name
        };
		
		var startGame = function () {
			app.gameRef.game.connected();
            app.gameRef.game.start();
			
			$('logincard').hide();

            app.gameRef.page.removeLoadingVeil();
            app.gameRef.page.removeWaitingVeil();

			$('#sound-label').show();
			$('#sound').get(0).play();
		};
		
        app.gameRef.ioModel.getSocket().emit('getMeIn', playerSelection, function(startInfo) {	
			me = { name: playerSelection.name, id: startInfo.playerId };
            app.gameRef.game.setSelf(me);
            $scope.setMe(me);

			if (startInfo.access) 
				startGame();
            else {
				// TODO: wait for game
                app.gameRef.page.showWaitingVeil();
			}
        });
		
		// if this message received, start the game immediately
		app.gameRef.ioModel.onData('yourIn', function (handShake) {
			if (handShake) {
				startGame();
			}
		});
    };
    $scope.select = function (charId) {
        $scope.character = $scope.characters[charId];
        $(".descriptionBox").slideDown();
    };
}]);

app.directive("logincard", function () {
    return {
        template:
            '<div class="input">Enter your name</div>' +
            '<input ng-model="name" type="text" class="input {{edited?\'playerName\':\'placeholderText\'}}" ng-click="setEdited()"/>' +
            '<div class="characterCard">' +
            '<avatar ng-repeat="char in characters" class="{{char.characterId==character.characterId?\'\':\'grayscale\'}}" character="{{char.characterId}}" ng-click="select({{char.characterId}})"></avatar>' +
            '</div>' +
            '<div class="descriptionBox">' +
            '<div class="playerName">{{character.name}}</div>' +
            '<div class="characterDescription">{{character.description}}</div>' +
            '</div>' +
            '<div class="selectButton" ng-click="send()">Select</div>',
        restrict: "E"
    }
});


app.directive("playercard", function () {
    return {
        restrict: "E",
        scope:{
            character : "@character",
            playername: "@playername",
            playerscore: "@playerscore"
        },
        template: '<div class="playerCard"><avatar character="{{character}}"></avatar>' +
            '<div><span>Name:</span></br><div class="playerName">{{playername}}</div></div>' +
            '<div><span>Score:</span><span class="playerScore">{{playerscore}}</span></div>' +
            '</div>',
        link: function (scope, element) {
           /* $(element).find(".playerName").text(scope.playername);
            $(element).find(".playerScore").text(scope.playerscore);    */
            $(element).find("div").css("overflow","hidden");
        }
    }
});