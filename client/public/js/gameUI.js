console.log("Loading GameUI class.");

function GameUI(options) {
    options = options || {};
    // Privates
    var model = options.gameModel || {};
    var box2d = options.box2d || {};
    var bg;
    var clickHandlers = [];
    var left, right, top, bottom;
    var hudId = options.hudId || "hud";
    var hud = document.getElementById(hudId);
    var canvasId = options.canvasId || "game";
    var canvasHeight = options.canvasHeight || 600;
    var canvasWidth = options.canvasWidth || 800;
    var canvas = document.getElementById(canvasId);

    var renderer = PIXI.autoDetectRenderer(canvasWidth, canvasHeight, undefined, false);
    canvas.appendChild(renderer.view);

    var stage = new PIXI.Stage(0xFFFFFF);

    var init = function () {
        left = 0;
        right = 800;
        top = 0;
        bottom = 600;

        // create background

        var bgTexture = PIXI.Texture.fromImage("./../img/bg.png");
        /*var bg = [new PIXI.Sprite(texture, {x:0, y:0, width:800, height:600}),
         new PIXI.Sprite(texture, {x:800, y:0, width:800, height:600}),
         new PIXI.Sprite(texture, {x:1600, y:0, width:800, height:600})]; */

        bg = new PIXI.Sprite(bgTexture);
        bg.width = 2400;
        bg.height = 1800;
        bg.position.x = -800;
        bg.position.y = 0;

        stage.addChild(bg);
    };

    var progress = function () {
        var me = model.getOwnPlayer();
        if (!me || !me.isReady()) return;
        var sprite = me.getSprite();

        //TODO: move the bg
        if (sprite.position.y > 350 && bg.position.y > -1200) {
            bg.position.y -= 40;
        }
        if ((sprite.position.x+90) > 500 && bg.position.x > -1601) {
            var x = -1600+((800-(sprite.position.x+90)) * 800 / 300 );
            if (x < -1600) { x = -1600; }
            bg.position.x = x;
        }
        if (sprite.position.x < 300 && bg.position.x < 1) {
            var x = -(sprite.position.x * 800 / 300 );
            if (x > 0) { x = 0; }
            bg.position.x = x;
        }

    };

    var render = function (time) {
        renderer.render(stage);
    };

    var onCanvasClick = function (callback) {
        clickHandlers.push(callback);
    };

    var createSpriteOn = function (player) {
        var assetsToLoad;
        switch (player.getCharacter()) {
            //case 0:  assetsToLoad = [ "./../img/pig.json"];
			case 1:  assetsToLoad = [ "./../img/bunny.json"]; break;
			case 2:  assetsToLoad = [ "./../img/deer.json"];break;
			case 3:  assetsToLoad = [ "./../img/dog.json"];break;
			case 4:  assetsToLoad = [ "./../img/pig.json"];break;
			case 5:  assetsToLoad = [ "./../img/cat.json"];break;
			default:
                assetsToLoad = [ "./../img/bunny.json"];
        }

        // create a new loader
        var loader = new PIXI.AssetLoader(assetsToLoad);
        // use callback
        loader.onComplete = function () {
            var sprite = new PIXI.Sprite.fromFrame('stand');
            // top/left
            sprite.position.x = player.getPosition().x;
            sprite.position.y = player.getPosition().y;

            stage.addChild(sprite);
            player.setSprite(sprite);

            player.setReady();
        };
        //begin load
        loader.load();
    };


    return {
        // Publics
        //canvas: canvas1,
        onCanvasClick: onCanvasClick,
        //  context: context,
        createSpriteOn: createSpriteOn,
        progress: progress,
        hud: hud,
        render: render,
        init: init
    }
}

module.exports = GameUI;