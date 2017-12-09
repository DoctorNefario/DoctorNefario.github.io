let pointWidth = 5;
let pointHeight = 5;
let pointsRight = 100;
let pointsDown = 100;
let pointMargin = 0.5;

let turtles = [];

function Turtle(posX, posY, direction) {
    this.curX = posX;
    this.curY = posY;
    this.facing = direction;
}

turtles.push(new Turtle( // Template for creating turtles
    47, // Starting X coordinate
    50, // Starting Y coordinate
    0 // Facing, 0 = Up, 1 = Right, etc...
));

turtles.push(new Turtle(50, 47, 1));

turtles.push(new Turtle(53, 50, 2));

turtles.push(new Turtle(50, 53, 3));

// Colours
let offShade = '#eee';
let onShade = '#222';
let backShade = '#ccc';
let fastShade = "#f00";
let stepShade = "#3e3";
let normalShade = "#4cf";

// End of customisation

let modeNames = ["Normal", "Fast", "Frame by frame"]; // Just for displaying the current mode
let modeTimeouts = [500, 0, "∞"];
let shades = [normalShade, fastShade, stepShade]; // This is easier to work with
let turtleShade = shades[0];

let modeNum = 0; // 0 = Normal, 1 = Fast, 2 = Frame by frame

let pointMarginT = pointMargin * 2;

let pointWidthAndMargin = pointWidth + pointMarginT;
let pointHeightAndMargin = pointHeight + pointMarginT;

let canvasWidth = pointsRight * (pointWidthAndMargin) + pointMarginT;
let canvasHeight = pointsDown * (pointHeightAndMargin) + pointMarginT;

let onOffGrid = [];
let blankGrid = [];

let canvas, ctx;

let assignedFrameTimeout;

let getId = document.getElementById;

function drawTurtle(turtleNum) {

}

function drawAllTurtles() {
    for (let i = 0; i < turtles.length; i++) {
        drawTurtle(i);
    }
}

function turnRight(turtleNum) {
    if (++turtles[turtleNum].facing > 3) {
        turtles[turtleNum].facing = 0;
    }
}

function turnLeft(turtleNum) {
    if (--turtles[turtleNum].facing < 0) {
        turtles[turtleNum].facing = 3;
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
    let turt = turtles[turtleNum];
    let sx;
    let sy;
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
    for (let i = 0; i < turtles.length; i++) findNextFrameFor(i);
}

function findNextFrameUntilEnd() {
    if (turtleEnd && messyEnd) {
        console.log("ended");
        for (let e = 0; e < turtles.length; e++) {
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
    getId("mode").innerHTML = modeNames[modeNum];
    getId("speed").innerHTML = turtleInterval;
    drawAllTurtles();

    clearTimeout(assignedFrameTimeout);
    findNextFrameUntilEnd();
}

function startTurtle() {

    let elem = getId('turtle-canvas');
    elem.width = canvasWidth;
    elem.height = canvasHeight;
    elem.style.backgroundColor = backShade;

    ctx.fillStyle = offShade;
    for (let startY = 0; startY < pointsDown; startY++) {
        blankGrid.push([]);
        for (let startX = 0; startX < pointsRight; startX++) {
            blankGrid[startY].push(0);

            let startRectX = startX * (pointWidthAndMargin) + pointMarginT;
            let startRectY = startY * (pointHeightAndMargin) + pointMarginT;

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

    canvas.onmousedown = function (e) {
        e.preventDefault();
        switch (e.which) {
            case 1:
                if (modeNum === 0) {
                    if (turtleInterval < 1000) {
                        turtleInterval = turtleInterval * 2;
                        getId("speed").innerHTML = turtleInterval;

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
                        getId("speed").innerHTML = turtleInterval;

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
    };

    startTurtle();
};