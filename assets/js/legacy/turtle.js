// Start of customisation

// Dimensions, in pixels
var pointWidth = 5;
var pointHeight = 5;

var pointsRight = 100;
var pointsDown = 100;

var pointMargin = 0.5;

var turtles = []; // Don't change this

turtles.push(new Turtle( // Template for creating turtles
    0, // Facing, 0 = Up, 1 = Right, etc...
    47, // Starting X coordinate
    50 // Starting Y coordinate
));

turtles.push(new Turtle(
    1,
    50,
    47
));

turtles.push(new Turtle(
    2,
    53,
    50
));

turtles.push(new Turtle(
    3,
    50,
    53
));

var turtleEnd = false;
var messyEnd = true;

var turtleInterval = 1000;

// Colours
var offShade = '#eee';
var onShade = '#222';
var backShade = '#ccc';
var fastShade = "#f00";
var stepShade = "#3e3";
var normalShade = "#4cf";


// End of customisation

var modeNames = ["Normal", "Fast", "Frame by frame"]; // Just for displaying the current mode
var modeTimeouts = [500, 0, "∞"]; // The string is bad practice, these should all be numbers
var shades = [normalShade, fastShade, stepShade]; // This is easier to work with
var turtleShade = shades[0];

var modeNum = 0; // 0 = Normal, 1 = Fast, 2 = Frame by frame

var pointMarginT = pointMargin * 2;

var pointWidthAndMargin = pointWidth + pointMarginT;
var pointHeightAndMargin = pointHeight + pointMarginT;

var canvasWidth = pointsRight * (pointWidthAndMargin) + pointMarginT;
var canvasHeight = pointsDown * (pointHeightAndMargin) + pointMarginT;

var onOffGrid = [];
var blankGrid = [];

var canvas, ctx;

var assignedFrameTimeout;

function Turtle(facing, startX, startY) {
    this.facing = facing;
    this.curX = startX;
    this.curY = startY;
}

function drawPoint(x, y) {
    var curVal = onOffGrid[y][x];
    if (curVal === 1) {
        ctx.fillStyle = onShade;
        ctx.fillRect(
            x * (pointWidthAndMargin) + pointMarginT,
            y * (pointHeightAndMargin) + pointMarginT,
            pointWidth,
            pointHeight
        );
    } else if (curVal === 0) {
        ctx.fillStyle = offShade;
        ctx.fillRect(
            x * (pointWidthAndMargin) + pointMarginT,
            y * (pointHeightAndMargin) + pointMarginT,
            pointWidth,
            pointHeight
        );
    }
}

function drawTurtle(turtleNum) {
    ctx.fillStyle = turtleShade;
    ctx.fillRect(
        turtles[turtleNum].curX * (pointWidthAndMargin) + pointMarginT,
        turtles[turtleNum].curY * (pointHeightAndMargin) + pointMarginT,
        pointWidth,
        pointHeight
    );

    var startX;
    var startY;
    var sizeX;
    var sizeY;

    switch (turtles[turtleNum].facing) {
        case 0:
            startX = turtles[turtleNum].curX * (pointWidthAndMargin) + pointMarginT + 1;
            startY = turtles[turtleNum].curY * (pointHeightAndMargin) + pointMarginT;
            sizeX = pointWidth - 2;
            sizeY = 1;
            break;
        case 1:
            startX = turtles[turtleNum].curX * (pointWidthAndMargin) + pointMarginT + pointWidth - 1;
            startY = turtles[turtleNum].curY * (pointHeightAndMargin) + pointMarginT + 1;
            sizeX = 1;
            sizeY = pointHeight - 2;
            break;
        case 2:
            startX = turtles[turtleNum].curX * (pointWidthAndMargin) + pointMarginT + 1;
            startY = turtles[turtleNum].curY * (pointHeightAndMargin) + pointMarginT + pointHeight - 1;
            sizeX = pointWidth - 2;
            sizeY = 1;
            break;
        case 3:
            startX = turtles[turtleNum].curX * (pointWidthAndMargin) + pointMarginT;
            startY = turtles[turtleNum].curY * (pointHeightAndMargin) + pointMarginT + 1;
            sizeX = 1;
            sizeY = pointHeight - 2;
            break;
    }

    ctx.fillStyle = onShade;
    ctx.fillRect(
        startX,
        startY,
        sizeX,
        sizeY
    );
}

function drawAllTurtles() {
    for (var i = 0; i < turtles.length; i++) {
        drawTurtle(i);
    }
}

function turnRight(turtleNum) {
    if (turtles[turtleNum].facing === 3) {
        turtles[turtleNum].facing = 0;
    } else {
        turtles[turtleNum].facing++;
    }
}

function turnLeft(turtleNum) {
    if (turtles[turtleNum].facing === 0) {
        turtles[turtleNum].facing = 3;
    } else {
        turtles[turtleNum].facing--;
    }
}

function moveForward(turtleNum) {
    // 0 is up, 1 is right, etc
    switch (turtles[turtleNum].facing) {
        case 0:
            if (turtles[turtleNum].curY > 0) {
                turtles[turtleNum].curY--;
            } else turtles[turtleNum].curY = pointsDown - 1;
            break;
        case 1:
            if (turtles[turtleNum].curX < pointsRight - 1) {
                turtles[turtleNum].curX++;
            } else turtles[turtleNum].curX = 0;
            break;
        case 2:
            if (turtles[turtleNum].curY < pointsDown - 1) {
                turtles[turtleNum].curY++;
            } else turtles[turtleNum].curY = 0;
            break;
        case 3:
            if (turtles[turtleNum].curX > 0) {
                turtles[turtleNum].curX--;
            } else turtles[turtleNum].curX = pointsRight - 1;
            break;
        default:
            throw "incorrect given: " + turtles[turtleNum].facing;
    }
}

function findNextFrameFor(turtleNum) {
    var turt = turtles[turtleNum];
    var sx;
    var sy;
    if (onOffGrid[turt.curY][turt.curX] === 0) {
        sx = turt.curX;
        sy = turt.curY;

        onOffGrid[turt.curY][turt.curX] = 1;

        turnRight(turtleNum);
        moveForward(turtleNum);
        drawPoint(sx, sy);
        drawTurtle(turtleNum);
    } else {
        sx = turt.curX;
        sy = turt.curY;

        onOffGrid[turt.curY][turt.curX] = 0;

        turnLeft(turtleNum);
        moveForward(turtleNum);
        drawPoint(sx, sy);
        drawTurtle(turtleNum);
    }
}

function findNextFrame() {
    for (var i = 0; i < turtles.length; i++) findNextFrameFor(i);
}

function findNextFrameUntilEnd() {
    if (turtleEnd && messyEnd) {
        console.log("ended");
        for (var e = 0; e < turtles.length; e++) {
            console.log("turtles " + e, turtles[e].curX, turtles[e].curY);
        }
    } else if (!turtleEnd) {
        findNextFrame();
        assignedFrameTimeout = setTimeout(function () {
            findNextFrameUntilEnd();
        }, turtleInterval);
    }
}

function nextMode() {
    modeNum++;
    if (modeNum >= modeNames.length) modeNum = 0;

    turtleEnd = modeNum === 2;
    messyEnd = !turtleEnd;

    turtleShade = shades[modeNum];
    turtleInterval = modeTimeouts[modeNum];
    $("#mode").empty().append(modeNames[modeNum]);
    $("#speed").empty().append(turtleInterval);
    drawAllTurtles();

    clearTimeout(assignedFrameTimeout);
    findNextFrameUntilEnd();
}

function startTurtle() {

    $('#turtle-canvas').attr({
        width: canvasWidth,
        height: canvasHeight
    }).css({
        backgroundColor: backShade
    });

    ctx.fillStyle = offShade;
    for (var startY = 0; startY < pointsDown; startY++) {
        blankGrid.push([]);
        for (var startX = 0; startX < pointsRight; startX++) {
            blankGrid[startY].push(0);

            var startRectX = startX * (pointWidthAndMargin) + pointMarginT;
            var startRectY = startY * (pointHeightAndMargin) + pointMarginT;

            ctx.fillRect(startRectX, startRectY, pointWidth, pointHeight);
        }
        onOffGrid.push(blankGrid[startY].slice(0));
    }

    drawAllTurtles();

    assignedFrameTimeout = setTimeout(function () {
        findNextFrameUntilEnd();
    }, turtleInterval);
}

window.onload = function () {
    canvas = document.getElementById('turtle-canvas');
    ctx = canvas.getContext('2d');

    $("#turtle-canvas").mousedown(function (e) {
        e.preventDefault();
        switch (e.which) {
            case 1:
                if (modeNum === 0) {
                    if (turtleInterval < 1000) {
                        turtleInterval = turtleInterval * 2;
                        $("#speed").empty().append(turtleInterval);

                        clearTimeout(assignedFrameTimeout);
                        findNextFrame();
                        assignedFrameTimeout = setTimeout(function () {
                            findNextFrameUntilEnd();
                        }, turtleInterval);
                    }
                } else if (modeNum === 2) {
                    findNextFrame();
                }
                break;
            case 2:
                nextMode();
                break;
            case 3:
                if (modeNum === 0) {
                    if (turtleInterval > 10) {
                        turtleInterval = turtleInterval / 2;
                        $("#speed").empty().append(turtleInterval);

                        clearTimeout(assignedFrameTimeout);
                        findNextFrame();
                        assignedFrameTimeout = setTimeout(function () {
                            findNextFrameUntilEnd();
                        }, turtleInterval);
                    }
                }
                break;
        }
        return true;
    });

    startTurtle();
};
