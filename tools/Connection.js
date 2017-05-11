Connection = function() {
    this.wires = {};
    this.current = "";
};

Connection.prototype.newWire = function(x, y, color) {
    var wireName = (new UUID).generateUUID();
    this.current = wireName;
    this.wires[wireName] = {
        points: [new Point(x, y)],
        color: color,
        active: false
    };
};

Connection.prototype.addPoint = function(x, y) {
    var points = this.wires[this.current].points;
    var lastPoint = points[points.length-1];
    var lastX = lastPoint.getX();
    var lastY = lastPoint.getY();
    if (!(lastX === x && lastY === y)) {
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
};

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

Connection.prototype.hasWire = function(x, y) {
    return this.getWireUUID(x, y) !== -1;
};

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

Connection.prototype.checkCurrent = function() {
    if (this.wires[this.current].points.length === 1) {
        delete this.wires[this.current];
        this.current = "";
    }
};

Connection.prototype.deleteAllWires = function() {
    this.wires = {};
    this.current = "";
};

Point = function(x, y) {
    this.x = x;
    this.y = y;

    this.getX = function() {
        return x;
    };

    this.getY = function() {
        return y;
    };
};

function isConnected(x, y, lastX, lastY) {
    return (x === lastX && (y === lastY-1 || y === lastY+1)) || ((x === lastX-1 || x === lastX+1) && y === lastY);
}