/**
 * Constructor for Wire object
 * @param x Horizontal start position of the wire
 * @param y Vertical start position of the wire
 * @param uuid UUID of the wire
 * @param color Color of the wire
 * @constructor Wire object
 */
Wire = function(x, y, uuid, color) {
    this.points = [new Point(x, y)];
    this.color = color;
    this.uuid = uuid;

    this.active = false;
    this.hasSource = false;
    this.hasGround = false;

    this.connectsTo = [];
};

/**
 * Adds a point to the Wire and any missing points
 * @param x Horizontal position of the point
 * @param y Vertical position of the point
 * @param addMissingPoints true if missing points should be added
 */
Wire.prototype.addPoint = function(x, y, addMissingPoints) {
    var lastPoint = this.points[this.points.length-1];
    var lastX = lastPoint.x;
    var lastY = lastPoint.y;
    var point;
    if (pointIsCorrect(x, y, lastX, lastY)) {
        while (addMissingPoints && !isConnected(x, y, lastX, lastY)) {
            if (lastX > x) {
                lastX--;
            } else if (lastX < x) {
                lastX++;
            } else if (lastY > y) {
                lastY--;
            } else if (lastY < y) {
                lastY++;
            }
            point = new Point(lastX, lastY);
            this.points.push(point);
            point.updateNeighbours(this);
            point.updateNeighboursNeighbours(this);
        }
        point = new Point(x, y);
        this.points.push(point);
        point.updateNeighbours(this);
        point.updateNeighboursNeighbours(this);
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

Wire.prototype.getPoint = function(x, y) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            return this.points[i];
        }
    }
    return undefined;
};

/**
 * Informs if the wire goes through the given point
 * @param x Horizontal position of the point
 * @param y Vertical position of the point
 * @returns {boolean} true if the wire goes through the point, false if not
 */
Wire.prototype.hasPoint = function(x, y) {
    return this.getPoint(x, y) !== undefined;
};

Wire.prototype.removePoint = function(index) {
    this.points.splice(index, 1);
};

Wire.prototype.getPointIndexes = function(x, y) {
    var indexes = [];
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            indexes.push(i);
        }
    }
    return indexes;
};

Wire.prototype.removeFirstOccurrences = function(x, y) {
    var indexes = this.getPointIndexes(x, y);
    var lastIndex = indexes[indexes.length-1];
    var lastPoint = this.points[lastIndex];

    var left = lastPoint.neighbours.left;
    var right = lastPoint.neighbours.right;
    var top = lastPoint.neighbours.top;
    var bottom = lastPoint.neighbours.bottom;

    for (var i = 0; i < indexes.length-1; i++) {
        left = (this.points[indexes[i]].neighbours.left !== undefined)? this.points[indexes[i]].neighbours.left : left;
        right = (this.points[indexes[i]].neighbours.right !== undefined)? this.points[indexes[i]].neighbours.right : right;
        top = (this.points[indexes[i]].neighbours.top !== undefined)? this.points[indexes[i]].neighbours.top : top;
        bottom = (this.points[indexes[i]].neighbours.bottom !== undefined)? this.points[indexes[i]].neighbours.bottom : bottom;

        this.removePoint(indexes[i]);
    }

    if (indexes.length > 1) {
        lastPoint.neighbours.left = left;
        lastPoint.neighbours.right = right;
        lastPoint.neighbours.top = top;
        lastPoint.neighbours.bottom = bottom;

        lastPoint.updateNeighboursNeighbours(this);
    }
};

/**
 * Informs if the wire goes through the point left of the given position
 * @param x Horizontal position of the point
 * @param y Vertical position of the point
 * @returns {boolean} true if the wire goes through the left point, false if not
 */
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

/**
 * Informs if the wire goes through the point right of the given position
 * @param x Horizontal position of the point
 * @param y Vertical position of the point
 * @returns {boolean} true if the wire goes through the right point, false if not
 */
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

/**
 * Informs if the wire goes through the point at the top of the given position
 * @param x Horizontal position of the point
 * @param y Vertical position of the point
 * @returns {boolean} true if the wire goes through the top point, false if not
 */
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

/**
 * Informs if the wire goes through the point at the bottom of the given position
 * @param x Horizontal position of the point
 * @param y Vertical position of the point
 * @returns {boolean} true if the wire goes through the bottom point, false if not
 */
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

Wire.prototype.getLeftNeighbour = function(x, y) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            var prevPoint = this.points[i-1];
            var nextPoint = this.points[i+1];

            if (prevPoint !== undefined && prevPoint.x === x-1 && prevPoint.y === y) {
                return prevPoint;
            }
            if (nextPoint !== undefined && nextPoint.x === x-1 && nextPoint.y === y) {
                return nextPoint;
            }
        }
    }
    return undefined;
};

Wire.prototype.getRightNeighbour = function(x, y) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            var prevPoint = this.points[i-1];
            var nextPoint = this.points[i+1];

            if (prevPoint !== undefined && prevPoint.x === x+1 && prevPoint.y === y) {
                return prevPoint;
            }
            if (nextPoint !== undefined && nextPoint.x === x+1 && nextPoint.y === y) {
                return nextPoint;
            }
        }
    }
    return undefined;
};

Wire.prototype.getTopNeighbour = function(x, y) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            var prevPoint = this.points[i-1];
            var nextPoint = this.points[i+1];

            if (prevPoint !== undefined && prevPoint.x === x && prevPoint.y === y-1) {
                return prevPoint;
            }
            if (nextPoint !== undefined && nextPoint.x === x && nextPoint.y === y-1) {
                return nextPoint;
            }
        }
    }
    return undefined;
};

Wire.prototype.getBottomNeighbour = function(x, y) {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x === x && this.points[i].y === y) {
            var prevPoint = this.points[i-1];
            var nextPoint = this.points[i+1];

            if (prevPoint !== undefined && prevPoint.x === x && prevPoint.y === y+1) {
                return prevPoint;
            }
            if (nextPoint !== undefined && nextPoint.x === x && nextPoint.y === y+1) {
                return nextPoint;
            }
        }
    }
    return undefined;
};
