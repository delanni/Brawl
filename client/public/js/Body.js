/**
 * Created by Alex on 2013.11.10..
 */

function Body(options) {
    var speedLimits = {
        x: 1,
        y: 1
    };
    var defaults = {
        width: 0,
        height: 0,
        speed: {
            x: 0,
            y: 0
        },
        position: {
            x: 0,
            y: 0
        }
    };
    options = options || defaults;

    var width = options.width || defaults.width;
    var height = options.height || defaults.height;
    var position = options.position || defaults.position;
    var speed = options.speed || defaults.speed;

    var applyForce = function (forceVector) {
        speed.x += forceVector.x;
        if (Math.abs(speed.x) > speedLimits.x) speed.x = speedLimits.x * (speed.x / Math.abs(speed.x));
        speed.y += forceVector.y;
        if (Math.abs(speed.y) > speedLimits.y) speed.y = speedLimits.y * (speed.y / Math.abs(speed.y));
    };

    var progress = function (time) {
        time = time || 1;
        position.x += speed.x * time;
        position.y += speed.y * time;
    };

    var GetPosition = function () {
        return {
            x: position.x,
            y: position.y
        }
    };

    var SetPosition = function (p) {
        position.x = p.x;
        position.y = p.y;
    };

    var GetSpeed = function () {
        return {
            x: speed.x,
            y: speed.y
        }
    };

    var SetSpeed = function () {
        speed.x = s.x;
        speed.y = s.y;
    };

    var GetBoundingBox = function () {
        return {
            x: position.x,
            y: position.y,
            width: width,
            height: height
        }
    };

    var getCenter = function () {
        return {
            x: (getLeft() + getRight()) / 2,
            y: (getTop() + getBottom()) / 2
        }
    };

    var checkCollide = function (otherBody) {
        if (otherBody.GetLeft() > getRight()) return false; // out to the left
        if (otherBody.GetRight() < getLeft()) return false; // out to the right
        if (otherBody.GetTop() > getBottom()) return false; // out to the top
        if (otherBody.GetBottom() < getTop()) return false;// out to the bottom

        var x =
            [
                getDistance(getRight(), otherBody.GetLeft()), // on the right
                getDistance(getLeft(), otherBody.GetRight()), // on the left
                getDistance(getTop(), otherBody.GetBottom()), // on the top
                getDistance(getBottom(), otherBody.GetTop()) // on the bottom
            ];
        if (x[0] < x[1]) {
            if (x[0] < x[2]) {
                if (x[0] < x[3]) return "right";
                else return "bottom";
            } else {
                if (x[2] < x[3]) return "top";
                else return "left";
            }
        } else {
            if (x[1] < x[2]) {
                if (x[1] < x[3]) return "left";
                else return "bottom";
            } else {
                if (x[2] < x[3]) return "top";
                else return "right";
            }
        }
    };

    var getDistance = function (one, other) {
        return Math.abs(one - other);
    };

    var getLeft = function () {
        return position.x;
    };
    var getRight = function () {
        return position.x + width;
    };
    var getTop = function () {
        return position.y;
    };
    var getBottom = function () {
        return position.y + height;
    };

    var setLeft = function (l) {
        position.x = l;
    };
    var setRight = function (r) {
        position.x = r - width;
    };
    var setTop = function (t) {
        position.y = t;
    };
    var setBottom = function (b) {
        position.y = b - height;
    };


    return {
        SetPosition: SetPosition,
        SetSpeed: SetSpeed,
        GetPosition: GetPosition,
        GetSpeed: GetSpeed,
        ApplyForce: applyForce,
        GetBoundingBox: GetBoundingBox,
        Collides: checkCollide,
        GetBottom: getBottom,
        GetTop: getTop,
        GetLeft: getLeft,
        GetRight: getRight,
        SetBottom: setBottom,
        SetTop: setTop,
        SetLeft: setLeft,
        SetRight: setRight,
        Step: progress
    };
}

module.exports = Body;