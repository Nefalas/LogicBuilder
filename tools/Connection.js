/**
 * Constructor for connections
 * @constructor Connection object
 */
Connection = function() {
    this.wires = {};
    this.current = "";
};

/**
 * Creates a new wire
 * @param x Horizontal cell start position of the wire
 * @param y Vertical cell start position of the wire
 * @param color Color of the wire
 */
Connection.prototype.newWire = function(x, y, color) {
    var wireName = (new UUID).generateUUID();
    this.current = wireName;
    this.wires[wireName] = {
        points: [new Point(x, y)],
        color: color,
        active: false,
        hasSource: false,
        hasGround: false
    };
};

/**
 * Adds a Point to the current wire
 * @param x Horizontal cell position of the Point
 * @param y Vertical cell position of the Point
 */
Connection.prototype.addPoint = function(x, y) {
    var points = this.wires[this.current].points;
    var lastPoint = points[points.length-1];
    var lastX = lastPoint.getX();
    var lastY = lastPoint.getY();
    if (pointsAreCorrect(x, y, lastX, lastY)) {
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
            points.push(new Point(lastX, lastY));
        }
        points.push(new Point(x, y));
    }

    function pointsAreCorrect(x, y, lastX, lastY) {
        return !(lastX === x && lastY === y)
            && (x >= 0 && y >= 0)
            && (x < contentWidth/cellWidth && y < contentHeight/cellHeight)
    }
};

/**
 * Outputs the UUID and Points of every wire
 */
Connection.prototype.logWires = function() {
    for (var name in this.wires) {
        if (this.wires.hasOwnProperty(name)) {
            console.log(name);
            for (var i = 0; i < this.wires[name].length; i++) {
                var point = this.wires[name][i];
                console.log("x:" + point.getX() + ", y: " + point.getY());
            }
        }
    }
};

/**
 * Returns the UUID of the wire at the given position, returns -1 if no wire is found
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {*} The UUID of the wire if found, -1 if not
 */
Connection.prototype.getWireUUID = function(x, y) {
    for (var uuid in this.wires) {
        if (this.wires.hasOwnProperty(uuid)) {
            for (var i = 0; i < this.wires[uuid].points.length; i++) {
                var point = this.wires[uuid].points[i];
                if (point.getX() === x && point.getY() === y) {
                    return uuid;
                }
            }
        }
    }
    return -1;
};

/**
 * Informs if a wire Point is found at the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a wire is found, false if not
 */
Connection.prototype.hasWire = function(x, y) {
    return this.getWireUUID(x, y) !== -1;
};

/**
 * Informs if a wire Point is present in the same wire on the left of the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a wire is found, false if not
 */
Connection.prototype.hasLeftNeighbour = function(x, y) {
    for (var uuid in this.wires) {
        if (this.wires.hasOwnProperty(uuid)) {
            var points = this.wires[uuid].points;
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                if (point.getX() === x && point.getY() === y) {
                    var prevPoint = points[i - 1];
                    var nextPoint = points[i + 1];

                    if (prevPoint !== undefined && prevPoint.getX() === x - 1 && prevPoint.getY() === y) {
                        return true;
                    }
                    if (nextPoint !== undefined && nextPoint.getX() === x - 1 && nextPoint.getY() === y) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

/**
 * Informs if a wire Point is present in the same wire on the right of the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a wire is found, false if not
 */
Connection.prototype.hasRightNeighbour = function(x, y) {
    for (var uuid in this.wires) {
        if (this.wires.hasOwnProperty(uuid)) {
            var points = this.wires[uuid].points;
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                if (point.getX() === x && point.getY() === y) {
                    var prevPoint = points[i - 1];
                    var nextPoint = points[i + 1];

                    if (prevPoint !== undefined && prevPoint.getX() === x + 1 && prevPoint.getY() === y) {
                        return true;
                    }
                    if (nextPoint !== undefined && nextPoint.getX() === x + 1 && nextPoint.getY() === y) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

/**
 * Informs if a wire Point is present in the same wire on the top of the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a wire is found, false if not
 */
Connection.prototype.hasTopNeighbour = function(x, y) {
    for (var uuid in this.wires) {
        if (this.wires.hasOwnProperty(uuid)) {
            var points = this.wires[uuid].points;
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                if (point.getX() === x && point.getY() === y) {
                    var prevPoint = points[i - 1];
                    var nextPoint = points[i + 1];

                    if (prevPoint !== undefined && prevPoint.getX() === x && prevPoint.getY() === y - 1) {
                        return true;
                    }
                    if (nextPoint !== undefined && nextPoint.getX() === x && nextPoint.getY() === y - 1) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

/**
 * Informs if a wire Point is present in the same wire on the bottom of the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a wire is found, false if not
 */
Connection.prototype.hasBottomNeighbour = function(x, y) {
    for (var uuid in this.wires) {
        if (this.wires.hasOwnProperty(uuid)) {
            var points = this.wires[uuid].points;
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                if (point.getX() === x && point.getY() === y) {
                    var prevPoint = points[i - 1];
                    var nextPoint = points[i + 1];

                    if (prevPoint !== undefined && prevPoint.getX() === x && prevPoint.getY() === y + 1) {
                        return true;
                    }
                    if (nextPoint !== undefined && nextPoint.getX() === x && nextPoint.getY() === y + 1) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

/**
 * Informs about the active state of the wire having the given UUID
 * @param uuid true if the wire is active, false if not
 */
Connection.prototype.isActive = function(uuid) {
    return this.wires[uuid].active;
};

/**
 * Corrects any errors present in the array of Points of the current wire and joins wires having common points
 */
Connection.prototype.checkCurrent = function() {
    var points = this.wires[this.current].points;
    if (points.length === 1) {
        var x = points[0].getX();
        var y = points[0].getY();
        if (!basicComponent.hasCloseComponent(x, y)) {
            delete this.wires[this.current];
            this.current = "";
        }
    }
    for (var uuid in this.wires) {
        if (this.wires.hasOwnProperty(uuid)) {
            if (uuid !== this.current && this.hasCommonPoint(this.current, uuid)) {
                this.joinWires(this.current, uuid);
            }
        }
    }
};

/**
 * Informs if the two given wires have common Points
 * @param uuid1 UUID of the first wire
 * @param uuid2 UUID of the second wire
 * @returns {boolean} true if the wires have common Points, false if not
 */
Connection.prototype.hasCommonPoint = function(uuid1, uuid2) {
    var points1 = this.wires[uuid1].points;
    var points2 = this.wires[uuid2].points;
    for (var i = 0; i < points1.length; i++) {
        var x1 = points1[i].getX();
        var y1 = points1[i].getY();
        for (var j = 0; j < points2.length; j++) {
            var x2 = points2[j].getX();
            var y2 = points2[j].getY();
            if (x1 === x2 && y1 === y2) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Adds the Points of the second wire to the Points of the first wire and deletes the second wire
 * @param uuid1 UUID of the first wire
 * @param uuid2 UUID of the second wire
 */
Connection.prototype.joinWires = function(uuid1, uuid2) {
    this.wires[uuid1].points = this.wires[uuid1].points.concat(this.wires[uuid2].points);
    delete this.wires[uuid2];
};

/**
 * Deletes all wires
 */
Connection.prototype.deleteAllWires = function() {
    this.wires = {};
    this.current = "";
};

/**
 * Informs if two Points are connected
 * @param x1 Horizontal cell position of the first wire
 * @param y1 Vertical cell position of the first wire
 * @param x2 Horizontal cell position of the second wire
 * @param y2 Vertical cell position of the second wire
 * @returns {boolean} true if the Points are connected, false if not
 */
function isConnected(x1, y1, x2, y2) {
    return (x1 === x2 && (y1 === y2-1 || y1 === y2+1)) || ((x1 === x2-1 || x1 === x2+1) && y1 === y2);
}