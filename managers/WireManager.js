WireManager = function() {
    this.wires = {};
    this.currentUUID = "";
};

WireManager.prototype.addPoint = function(x, y, color) {
    var uuid = this.getWireUUID(x, y);
    if (uuid !== -1) {
        this.currentUUID = uuid;
        this.wires[uuid].addPoint(x, y, false);
    } else {
        uuid = (new UUID()).generateUUID();
        this.currentUUID = uuid;
        this.wires[uuid] = new Wire(x, y, uuid, color);
    }
};

WireManager.prototype.addPointToCurrent = function(x, y) {
    var uuid = this.getWireUUID(x, y);

    if (uuid !== -1 && uuid !== this.currentUUID) {
        this.joinWires(uuid, this.currentUUID);
    }

    this.wires[this.currentUUID].addPoint(x, y, true);
};

WireManager.prototype.getWireUUID = function(x, y) {
    for (var uuid in this.wires) {
        if (this.wires.hasOwnProperty(uuid)) {
            if (this.wires[uuid].hasPoint(x, y)) {
                return uuid;
            }
        }
    }
    return -1;
};

WireManager.prototype.getWire = function(x, y) {
    return this.wires[this.getWireUUID(x, y)];
};

WireManager.prototype.hasWire = function(x, y) {
    return this.getWireUUID(x, y) !== -1;
};

WireManager.prototype.joinWires = function(uuid1, uuid2) {
    this.wires[uuid1].points = this.wires[uuid1].points.concat(this.wires[uuid2].points);
    delete this.wires[uuid2];
    this.currentUUID = uuid1;
};

WireManager.prototype.removePoint = function(x, y) {

};

WireManager.prototype.deleteAllWires = function() {
    this.wires = {};
    this.currentUUID = "";
};

WireManager.prototype.updateConnections = function(uuid) {
    var wire = this.wires[uuid];
    wire.connectsTo = [];
    var points = this.wires[uuid].points;

    for (var i = 0; i < points.length; i++) {
        var x = points[i].x;
        var y = points[i].y;

        var leftElement = elementManager.getElement(x-1, y);
        var rightElement = elementManager.getElement(x+1, y);
        var topElement = elementManager.getElement(x, y-1);
        var bottomElement = elementManager.getElement(x, y+1);

        if (leftElement !== undefined && leftElement.type !== "wire") {
            wire.connectsTo.push(leftElement.element);
        }
        if (rightElement !== undefined && rightElement.type !== "wire") {
            wire.connectsTo.push(rightElement.element);
        }
        if (topElement !== undefined && topElement.type !== "wire") {
            wire.connectsTo.push(topElement.element);
        }
        if (bottomElement !== undefined && bottomElement.type !== "wire") {
            wire.connectsTo.push(bottomElement.element);
        }
    }
};

WireManager.prototype.logWires = function() {
    var size = 0;
    for (var uuid in this.wires) {
        if (this.wires.hasOwnProperty(uuid)) {
            size++;
            var i;
            console.log("Wire: " + uuid);
            for (i = 0; i < this.wires[uuid].points.length; i++) {
                var point = this.wires[uuid].points[i];
                console.log("   x:" + point.x + ", y: " + point.y + ", active: " + point.active);
                if (point.neighbours.left !== undefined) {
                    console.log("      └> left: x: " + point.neighbours.left.x  + ", y:" + point.neighbours.left.y);
                } else {
                    console.log("      └> left: undefined");
                }
                if (point.neighbours.right !== undefined) {
                    console.log("      └> right: x: " + point.neighbours.right.x  + ", y:" + point.neighbours.right.y);
                } else {
                    console.log("      └> right: undefined");
                }
                if (point.neighbours.top !== undefined) {
                    console.log("      └> top: x: " + point.neighbours.top.x  + ", y:" + point.neighbours.top.y);
                } else {
                    console.log("      └> top: undefined");
                }
                if (point.neighbours.bottom !== undefined) {
                    console.log("      └> bottom: x: " + point.neighbours.bottom.x  + ", y:" + point.neighbours.bottom.y);
                } else {
                    console.log("      └> bottom: undefined");
                }
            }
            console.log("   Connects to:");
            for (i = 0; i < this.wires[uuid].connectsTo.length; i++) {
                var element = this.wires[uuid].connectsTo[i];
                console.log("       └> " + element.uuid);
            }
            console.log(" ");
        }
    }
    console.log("Total wires: " + size);
    console.log(" ");
};