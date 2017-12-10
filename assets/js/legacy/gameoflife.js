// Start of customisation
// Never make 1 dimensional, it breaks

// Dimensions, in px (Can't change measurement)
var pointWidth = 20;
var pointHeight = 20;

var pointMargin = 1;

var pointsRight = 20;
var pointsDown = 20;

// Colours
var onShade = '#222';
var offShade = '#eee';
var previewShade = "#7de";
var backShade = '#ccc';

var drawMode = 0;

// Whether or not it loops
var loopsAround = true;

// End of customisation

var dragging = false;
var dragMode = 1;

var lx = null;
var ly = null;

var modeShades = [offShade, onShade];

var loopFrames = false;
var stepTimeout = 100;
var nextFrameTimeout;

var pointMarginT = pointMargin * 2;

var pointWidthAndMargin = pointWidth + pointMarginT;
var pointHeightAndMargin = pointHeight + pointMarginT;

var canvasWidth = pointsRight * (pointWidthAndMargin) + pointMarginT;
var canvasHeight = pointsDown * (pointHeightAndMargin) + pointMarginT;

var onOffGrid = [];
var surroundingGrid = [];
var needsUpdatePoints = [];
var blankGrid = [];

var canvas, jCanvas, ctx;

function returnMousePointOnGrid(e) {
    var offset = jCanvas.offset();

    var relX, relY;

    if (isNaN(e.pageX)) {
        relX = e.touches[0].pageX - offset.left;
        relY = e.touches[0].pageY - offset.top;
    } else {
        relX = e.pageX - offset.left;
        relY = e.pageY - offset.top;
    }

    var gridX = Math.floor(relX / (pointWidthAndMargin));
    var gridY = Math.floor(relY / (pointHeightAndMargin));

    return [gridX, gridY];
}

function drawPoint(x, y, mode) {
    ctx.fillStyle = modeShades[mode];
    ctx.fillRect(
        x * (pointWidthAndMargin) + pointMarginT,
        y * (pointHeightAndMargin) + pointMarginT,
        pointWidth,
        pointHeight
    );
}

function turnPoint(x, y, mode) {
    onOffGrid[y][x] = mode;

    drawPoint(x, y, mode);
}

function togglePoint(x, y) {
    var curVal = onOffGrid[y][x];
    if (curVal === 1) {
        onOffGrid[y][x] = 0;
    } else {
        onOffGrid[y][x] = 1;
    }

    drawPoint(x, y, onOffGrid[y][x]);
}

function updateVisual(x, y) {
    var curVal = onOffGrid[y][x];
    drawPoint(x, y, curVal);
}

function turnPointOn(x, y) {
    onOffGrid[y][x] = 1;
    drawPoint(x, y, 1);
}

function turnPointOff(x, y) {
    onOffGrid[y][x] = 0;
    drawPoint(x, y, 0);
}

function previewDraw(x, y) {
    ctx.fillStyle = previewShade;
    ctx.fillRect(
        x * (pointWidthAndMargin) + pointMarginT,
        y * (pointHeightAndMargin) + pointMarginT,
        pointWidth,
        pointHeight
    );
}


function calculateSurrounding(x, y) {
    var edgeLeft = x === 0;
    var edgeRight = x === pointsRight - 1;

    var edgeTop = y === 0;
    var edgeBottom = y === pointsDown - 1;

    var totalSurrounding = 0;

    var rangeY;
    var normRangeX;
    var otherRangeX;

    if (loopsAround) {
        if (edgeLeft) {
            normRangeX = [pointsRight - 1, 0, 1];
            otherRangeX = [pointsRight - 1, 1];
        } else if (edgeRight) {
            normRangeX = [x - 1, x, 0];
            otherRangeX = [x - 1, 0];
        } else {
            normRangeX = [x - 1, x, x + 1];
            otherRangeX = [x - 1, x + 1];
        }

        if (edgeTop) {
            rangeY = [pointsDown - 1, 0, 1];
        } else if (edgeBottom) {
            rangeY = [y - 1, y, 0];
        } else {
            rangeY = [y - 1, y, y + 1];
        }
    } else {
        if (edgeLeft) {
            normRangeX = [0, 1];
            otherRangeX = [1];
        } else if (edgeRight) {
            normRangeX = [x - 1, x];
            otherRangeX = [x - 1];
        } else {
            normRangeX = [x - 1, x, x + 1];
            otherRangeX = [x - 1, x + 1];
        }

        if (edgeTop) {
            rangeY = [0, 1];
        } else if (edgeBottom) {
            rangeY = [y - 1, y];
        } else {
            rangeY = [y - 1, y, y + 1];
        }
    }

    rangeY.forEach(function (elemY) {
        if (elemY === y) {
            otherRangeX.forEach(function (elemX) {
                if (onOffGrid[elemY][elemX] === 1) {
                    totalSurrounding++;
                }
            });
        } else {
            normRangeX.forEach(function (elemX) {
                if (onOffGrid[elemY][elemX] === 1) {
                    totalSurrounding++;
                }
            });
        }
    });

    return totalSurrounding;
}

function altAllSurrounding() {

    for (var i = 0; i < surroundingGrid.length; i++) {
        surroundingGrid[i] = blankGrid[i].slice(0);
    }

    console.log(surroundingGrid[0][0], blankGrid[0][0]);

    for (var y = 0; y < onOffGrid.length; y++) {
        var curIndex = onOffGrid[y].indexOf(1, 0);
        while (curIndex !== -1) {
            var edgeLeft = curIndex === 0;
            var edgeRight = curIndex === pointsRight - 1;

            var edgeTop = y === 0;
            var edgeBottom = y === pointsDown - 1;

            var rangeY;
            var normRangeX;
            var otherRangeX;
            if (loopsAround) {
                if (edgeLeft) {
                    normRangeX = [pointsRight - 1, 0, 1];
                    otherRangeX = [pointsRight - 1, 1];
                } else if (edgeRight) {
                    normRangeX = [curIndex - 1, curIndex, 0];
                    otherRangeX = [curIndex - 1, 0];
                } else {
                    normRangeX = [curIndex - 1, curIndex, curIndex + 1];
                    otherRangeX = [curIndex - 1, curIndex + 1];
                }

                if (edgeTop) {
                    rangeY = [pointsDown - 1, 0, 1];
                } else if (edgeBottom) {
                    rangeY = [y - 1, y, 0];
                } else {
                    rangeY = [y - 1, y, y + 1];
                }
            } else {
                if (edgeLeft) {
                    normRangeX = [0, 1];
                    otherRangeX = [1];
                } else if (edgeRight) {
                    normRangeX = [curIndex - 1, curIndex];
                    otherRangeX = [curIndex - 1];
                } else {
                    normRangeX = [curIndex - 1, curIndex, curIndex + 1];
                    otherRangeX = [curIndex - 1, curIndex + 1];
                }

                if (edgeTop) {
                    rangeY = [0, 1];
                } else if (edgeBottom) {
                    rangeY = [y - 1, y];
                } else {
                    rangeY = [y - 1, y, y + 1];
                }
            }

            rangeY.forEach(function (elemY) {
                if (elemY === y) {
                    otherRangeX.forEach(function (elemX) {
                        surroundingGrid[elemY][elemX] += 1;
                    });
                } else {
                    normRangeX.forEach(function (elemX) {
                        surroundingGrid[elemY][elemX] += 1;
                    });
                }
            });

            curIndex = onOffGrid[y].indexOf(1, curIndex + 1);
        }
    }
}

function setUpdatePoints(x, y) {
    if (onOffGrid[y][x] === 1) {
        var edgeLeft = x === 0;
        var edgeRight = x === pointsRight - 1;

        var edgeTop = y === 0;
        var edgeBottom = y === pointsDown - 1;

        var rangeY;
        var normRangeX;

        if (loopsAround) {
            if (edgeLeft) {
                normRangeX = [pointsRight - 1, 0, 1];
            } else if (edgeRight) {
                normRangeX = [x - 1, x, 0];
            } else {
                normRangeX = [x - 1, x, x + 1];
            }

            if (edgeTop) {
                rangeY = [pointsDown - 1, 0, 1];
            } else if (edgeBottom) {
                rangeY = [y - 1, y, 0];
            } else {
                rangeY = [y - 1, y, y + 1];
            }
        } else {
            if (edgeLeft) {
                normRangeX = [0, 1];
            } else if (edgeRight) {
                normRangeX = [x - 1, x];
            } else {
                normRangeX = [x - 1, x, x + 1];
            }

            if (edgeTop) {
                rangeY = [0, 1];
            } else if (edgeBottom) {
                rangeY = [y - 1, y];
            } else {
                rangeY = [y - 1, y, y + 1];
            }
        }

        rangeY.forEach(function (elemY) {
            normRangeX.forEach(function (elemX) {
                if (needsUpdatePoints.indexOf([elemX, elemY]) === -1) {
                    needsUpdatePoints.push([elemX, elemY]);
                }
            });
        });
    }
}

function findAllUpdatePoints() {
    for (var updateY = 0; updateY < pointsDown; updateY++) {
        for (var updateX = 0; updateX < pointsRight; updateX++) {
            setUpdatePoints(updateX, updateY);
        }
    }
}

function clearGrid() {
    for (var gy = 0; gy < onOffGrid.length; gy++) {
        for (var gx = 0; gx < onOffGrid[gy].length; gx++) {
            if (onOffGrid[gy][gx] === 1) {
                turnPointOff(gx, gy);
            }
        }
    }
}

function drawCanvas() {

    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('style', 'background:' + backShade + ';');

    ctx.fillStyle = offShade;
    for (var startY = 0; startY < pointsDown; startY++) {
        for (var startX = 0; startX < pointsRight; startX++) {
            var startRectX = startX * (pointWidthAndMargin) + pointMarginT;
            var startRectY = startY * (pointHeightAndMargin) + pointMarginT;

            ctx.fillRect(startRectX, startRectY, pointWidth, pointHeight);
        }
    }
}

function startGoL() {
    modeShades = [offShade, onShade];

    loopFrames = false;
    stepTimeout = 100;

    pointMarginT = pointMargin * 2;

    pointWidthAndMargin = pointWidth + pointMarginT;
    pointHeightAndMargin = pointHeight + pointMarginT;

    canvasWidth = pointsRight * (pointWidthAndMargin) + pointMarginT;
    canvasHeight = pointsDown * (pointHeightAndMargin) + pointMarginT;

    onOffGrid = [];
    surroundingGrid = [];
    needsUpdatePoints = [];
    blankGrid = [];

    console.log("Drawing grid");
    console.log(pointWidth + "px point width | " + pointHeight + "px point height | " + pointMargin + "px margin");
    console.log(pointsRight + " points across | " + pointsDown + " points down");
    console.log(canvasWidth + "px total width | " + canvasHeight + "px total height");
    console.log("Draw mode: " + drawMode);

    // Sets visual stuff
    $("#right-click-menu").css("width", canvasWidth);
    $("#gol-window").css({
        width: canvasWidth,
        height: canvasHeight + 120
    });

    $(".menu-button").css("width", Math.floor(canvasWidth / 3) - 3);

    $("#gol-menu").css({
        width: canvasWidth,
        height: canvasHeight + 120
    });

    drawCanvas();

    for (var startY = 0; startY < pointsDown; startY++) {
        blankGrid.push([]);

        for (var startX = 0; startX < pointsRight; startX++) {
            blankGrid[startY].push(0);
        }

        onOffGrid.push(blankGrid[startY].slice());
        surroundingGrid.push(blankGrid[startY].slice());
    }

}

function findNextFrame() {
    findAllUpdatePoints();

    needsUpdatePoints.forEach(function (elem) {
        surroundingGrid[elem[1]][elem[0]] = calculateSurrounding(elem[0], elem[1]);
    });

    needsUpdatePoints.forEach(function (elem) {
        if (onOffGrid[elem[1]][elem[0]] === 0) {
            if (surroundingGrid[elem[1]][elem[0]] === 3) {
                turnPointOn(elem[0], elem[1]);
            }
        } else if (surroundingGrid[elem[1]][elem[0]] < 2 || surroundingGrid[elem[1]][elem[0]] > 3) {
            turnPointOff(elem[0], elem[1]);
        }
    });

    needsUpdatePoints = blankGrid.slice(0);
}

function altFindNextFrame() {
    // This is much faster for many points, but slower for few.
    // When I was making it, I was actually expecting the opposite
    findAllUpdatePoints();

    altAllSurrounding();

    needsUpdatePoints.forEach(function (elem) {
        if (onOffGrid[elem[1]][elem[0]] === 0) {
            if (surroundingGrid[elem[1]][elem[0]] === 3) {
                turnPointOn(elem[0], elem[1]);
            }
        } else if (surroundingGrid[elem[1]][elem[0]] < 2 || surroundingGrid[elem[1]][elem[0]] > 3) {
            turnPointOff(elem[0], elem[1]);
        }
    });

    needsUpdatePoints = blankGrid.slice(0);
}

function fillGrid() {
    for (var y = 0; y < onOffGrid.length; y++) {
        for (var x = 0; x < onOffGrid[y].length; x++) {
            onOffGrid[y][x] = 1;
            updateVisual(x, y);
        }
    }
}

function timedFindNextFrame() {
    var t0 = performance.now();
    findNextFrame();
    var t1 = performance.now();
    console.log("Frame took " + (t1 - t0) + "ms");
}

function timedAltFindNextFrame() {
    var t0 = performance.now();
    altFindNextFrame();
    var t1 = performance.now();
    console.log("Frame took " + (t1 - t0) + "ms");
}

function frameLoop() {
    if (loopFrames) {
        findNextFrame();
        nextFrameTimeout = setTimeout(frameLoop, stepTimeout);
    }
}

function resetGoLTimeout() {
    clearTimeout(nextFrameTimeout);
    frameLoop();
}

function mousePreview(x, y) {
    if (lx !== x || ly !== y) {
        if (lx !== null && ly !== null && lx < pointsRight && ly < pointsDown) {
            if (onOffGrid[ly][lx] === 0) {
                drawPoint(lx, ly, 0);
            } else {
                drawPoint(lx, ly, 1);
            }
        }

        previewDraw(x, y);

        lx = x;
        ly = y;
    }
}

window.onload = function () {

    jCanvas = $("#gol-canvas");
    canvas = document.getElementById('gol-canvas');
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', function (e) {
        dragging = true;
        var xy = returnMousePointOnGrid(e);

        var x = xy[0];
        var y = xy[1];

        if (x < pointsRight && y < pointsDown) {
            togglePoint(x, y);
            updateVisual(x, y);
        }
        dragMode = onOffGrid[y][x];
    }, false);

    canvas.addEventListener('mousemove', function (e) {
        var xy = returnMousePointOnGrid(e);

        var x = xy[0];
        var y = xy[1];

        if (dragging) {
            if ((x !== lx || y !== ly) && x < pointsRight && y < pointsDown) {
                turnPoint(x, y, dragMode);
                previewDraw(x, y);
                if (lx !== null && ly !== null) {
                    updateVisual(lx, ly);
                }
                lx = x;
                ly = y;
            }
        } else {
            mousePreview(x, y);
        }
    }, false);

    canvas.addEventListener('mouseup', function () {
        dragging = false;
    }, false);

    canvas.addEventListener('mouseleave', function () {
        dragging = false;
        drawPoint(lx, ly, 0);
        lx = ly = null;
    }, false);

    // Now, for touch!
    canvas.addEventListener('touchstart', function (e) {
        // e.preventDefault();
        dragging = true;
        var xy = returnMousePointOnGrid(e);

        var x = xy[0];
        var y = xy[1];

        if (x < pointsRight && y < pointsDown) {
            togglePoint(x, y);
            updateVisual(x, y);
        }
        dragMode = onOffGrid[y][x];
    }, false);

    canvas.addEventListener('touchmove', function (e) {
        var xy = returnMousePointOnGrid(e);

        var x = xy[0];
        var y = xy[1];

        if (dragging) {
            if ((x !== lx || y !== ly) && x < pointsRight && y < pointsDown) {
                turnPoint(x, y, dragMode);
                if (lx !== null && ly !== null) {
                    updateVisual(lx, ly);
                }
                lx = x;
                ly = y;
            }
        }
        e.preventDefault();
    }, false);

    canvas.addEventListener('touchend', function (e) {
        e.preventDefault();
        dragging = false;
    }, false);

    canvas.addEventListener('touchcancel', function (e) {
        e.preventDefault();
    }, false);

    // For turtle, opens a new window
    document.getElementById("turtle-in-new-window").addEventListener('click', function () {
        window.open("turtle", "", "fullscreen=no, width=800, height=720");
        return false;
    });

    var playPause = $("#play-pause");
    playPause.click(function () {
        clearTimeout(nextFrameTimeout);
        loopFrames = !loopFrames;
        if (loopFrames) {
            playPause.empty().append("Pause");
        } else {
            playPause.empty().append("Play");
        }
        frameLoop();
    });

    $("#clear").click(function () {
        clearGrid();
    });

    $("#step").click(function () {
        findNextFrame();
    });

    $("#interval-slider").change(function () {
        stepTimeout = parseInt($("#interval-slider").val());
        $("#interval-number").val(stepTimeout);
        resetGoLTimeout();
    });


    $("#interval-number").change(function () {
        stepTimeout = parseInt($("#interval-number").val());
        resetGoLTimeout();
    }).val(stepTimeout);

    startGoL();
};
