Wire = function(x, y, color) {
    this.points = [new Point(x, y)];
    this.color = color;
    this.active = false;
    this.hasSource = false;
    this.hasGround = false;
};

Wire.prototype.addPoint = function(x, y) {
    var lastPoint = this.points[this.points.length-1];
    var lastX = lastPoint.x;
    var lastY = lastPoint.y;
    if (pointIsCorrect(x, y, lastX, lastY)) {
        while (!isConnected(x, y, lastX, lastY)) {
            if (lastX > x) {
                lastX--;
            } else if (lastX < x) {
                lastX++;
            } else if (lastY > y) {
                lastY--;
            } else if (lastY < y) {
                lastY++;
            }
            this.points.push(new Point(lastX, lastY));
        }
        this.points.push(new Point(x, y));
    }

    function pointIsCorrect(x, y, lastX, lastY) {
        return !(lastX === x && lastY === y)
            && (x >= 0 && y >= 0)
            && (x < contentWidth/cellWidth && y < contentHeight/cellHeight)
    }

    function isConnected(x1, y1, x2, y2) {
        return (x1 === x2 && (y1 === y2-1 || y1 === y2+1)) || ((x1 === x2-1 || x1 === x2+1) && y1 === y2);
    }
};

Wire.prototype.hasPoint = function(x, y) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            return true;
        }
    }
    return false;
};

Wire.prototype.hasLeftNeighbour = function(x, y) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            var prevPoint = this.points[i-1];
            var nextPoint = this.points[i+1];

            if (prevPoint !== undefined && prevPoint.x === x-1 && prevPoint.y === y) {
                return true;
            }
            if (nextPoint !== undefined && nextPoint.x === x-1 && nextPoint.y === y) {
                return true;
            }
        }
    }
    return false;
};

Wire.prototype.hasRightNeighbour = function(x, y) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            var prevPoint = this.points[i-1];
            var nextPoint = this.points[i+1];

            if (prevPoint !== undefined && prevPoint.x === x+1 && prevPoint.y === y) {
                return true;
            }
            if (nextPoint !== undefined && nextPoint.x === x+1 && nextPoint.y === y) {
                return true;
            }
        }
    }
    return false;
};

Wire.prototype.hasTopNeighbour = function(x, y) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            var prevPoint = this.points[i-1];
            var nextPoint = this.points[i+1];

            if (prevPoint !== undefined && prevPoint.x === x && prevPoint.y === y-1) {
                return true;
            }
            if (nextPoint !== undefined && nextPoint.x === x && nextPoint.y === y-1) {
                return true;
            }
        }
    }
    return false;
};

Wire.prototype.hasBottomNeighbour = function(x, y) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            var prevPoint = this.points[i-1];
            var nextPoint = this.points[i+1];

            if (prevPoint !== undefined && prevPoint.x === x && prevPoint.y === y+1) {
                return true;
            }
            if (nextPoint !== undefined && nextPoint.x === x && nextPoint.y === y+1) {
                return true;
            }
        }
    }
    return false;
};