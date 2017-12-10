// Variable declaration

// Dimensions, in px (Can't change measurement)
var pointWidth = 30;
var pointHeight = 30;

var pointMargin = 1;

var pointsRight = 9;
var pointsDown = 9;

// Colours

var onShade = '#222';
var offShade = '#bbb';

var canvas, ctx;

var pointMarginT;

function initAutomata() {
    canvas = document.getElementById('automata-canvas');
    ctx = canvas.getContext('2d');

    pointMarginT = pointMargin * 2;

    console.log(canvas, ctx);

    canvas.setAttribute('width', (pointWidth + pointMarginT) * pointsRight + pointMarginT);
    canvas.setAttribute('height', (pointHeight + pointMarginT) * pointsDown + pointMarginT);

    ctx.fillStyle = offShade;
    for (var startY = 0; startY < pointsDown; startY++) {
        for (var startX = 0; startX < pointsRight; startX++) {
            var startRectX = startX * (pointWidth + pointMarginT) + pointMarginT;
            var startRectY = startY * (pointHeight + pointMarginT) + pointMarginT;

            ctx.fillRect(startRectX, startRectY, pointWidth, pointHeight);
        }
    }

    var startPointX = 4 * (pointWidth + pointMarginT) + pointMarginT;
    var startPointY = pointMarginT;
    ctx.fillStyle = onShade;
    ctx.fillRect(startPointX, startPointY, pointWidth, pointHeight);
}

window.onload = function () {
    initAutomata();
};