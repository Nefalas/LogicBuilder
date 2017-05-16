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

WireManager.prototype.logWires = function() {
    var size = 0;
    for (var uuid in this.wires) {
        if (this.wires.hasOwnProperty(uuid)) {
            size++;
            console.log("Wire: " + uuid);
            for (var i = 0; i < this.wires[uuid].points.length; i++) {
                var point = this.wires[uuid].points[i];
                console.log("x:" + point.x + ", y: " + point.y);
                if (point.left !== undefined) {
                    console.log("   └> left: x: " + point.left.x  + ", y:" + point.left.y);
                } else {
                    console.log("   └> left: undefined");
                }
                if (point.right !== undefined) {
                    console.log("   └> right: x: " + point.right.x  + ", y:" + point.right.y);
                } else {
                    console.log("   └> right: undefined");
                }
                if (point.top !== undefined) {
                    console.log("   └> top: x: " + point.top.x  + ", y:" + point.top.y);
                } else {
                    console.log("   └> top: undefined");
                }
                if (point.bottom !== undefined) {
                    console.log("   └> bottom: x: " + point.bottom.x  + ", y:" + point.bottom.y);
                } else {
                    console.log("   └> bottom: undefined");
                }
            }
        }
    }
    console.log("Total wires: " + size);
};