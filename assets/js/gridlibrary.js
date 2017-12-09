function LibraryObject() {
    this.drawPoint = function (drawX, drawY, type) {
        let l = (this.pointWidth + this.pointMargin * 2) * drawX + this.pointMargin;
        let t = (this.pointHeight + this.pointMargin * 2) * drawY + this.pointMargin;
        this.context.fillStyle = this.colors[type];
        this.context.fillRect(l, t, this.pointWidth, this.pointHeight);
    };
    this.resetPoints = function () {
        let x, y;
        for (x = 0; x < pointsRight; ++x)
            for (y = 0; y < pointsDown; ++y)
                this.drawPoint(x, y, 0);
    };
    this.updateColors = function(off, on, sel) {
        this.offColor = off;
        this.onColor = on;
        this.selectedColor = sel;
        this.colors = [off, on, sel];
    };
}

function initializeCanvas(canvasElement, options) {
    let hasProperty = options.hasOwnProperty;

    let retLib = new LibraryObject();
    retLib.element = canvasElement;
    retLib.context = canvasElement.getContext("2d");
    retLib.pointsAcross = hasProperty("pointsAcross") ? options.pointsAcross : 20;
    retLib.pointsDown = hasProperty("pointsDown") ? options.pointsDown : 20;
    retLib.pointWidth = hasProperty("pointWidth") ? options.pointWidth : 10;
    retLib.pointHeight = hasProperty("pointHeight") ? options.pointHeight : 10;
    retLib.pointMargin = hasProperty("pointMargin") ? options.pointMargin : 2;

    context.width = (pointWidth + pointMargin * 2) * pointsAcross;
    context.height = (pointHeight + pointMargin * 2) * pointsDown;
    canvasElement.width = context.width;
    canvasElement.height = context.height;

    retLib.backgroundColor = hasProperty("backgroundColor") ? options.backgroundColor : "#555";
    retLib.offColor = hasProperty("offColor") ? options.offColor : "#000";
    retLib.onColor = hasProperty("onColor") ? options.onColor : "#fff";
    retLib.selectedColor = hasProperty("selectedColor") ? options.selectedColor : "#0ff";

    retLib.colors = [retLib.offColor, retLib.onColor, retLib.selectedColor];

    context.fillStyle = retLib.backgroundColor;
    context.fillRect(0, 0, context.width, context.height);

    retLib.resetPoints();

    return retLib;
}

