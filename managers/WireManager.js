WireManager = function() {
    this.wires = {};
    this.currentUUID = "";
};

WireManager.prototype.getCurrentUUID = function() {
    return this.currentUUID;
};

WireManager.prototype.setCurrentUUID = function(uuid) {
    this.currentUUID = uuid;
};

WireManager.prototype.addPoint = function(x, y, color) {
    var uuid = this.getWireUUID(x, y);
    if (uuid !== -1) {
        this.currentUUID = uuid;
        this.wires[uuid].addPoint(x, y);
    } else {
        uuid = (new UUID()).generateUUID();
        this.currentUUID = uuid;
        this.wires[uuid] = new Wire(x, y, color);
    }
};

WireManager.prototype.addPointToCurrent = function(x, y) {
    var uuid = this.getWireUUID(x, y);
    this.wires[this.currentUUID].addPoint(x, y);

    if (uuid !== -1 && uuid !== this.currentUUID) {
        this.joinWires(uuid, this.currentUUID);
    }
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
    var uuid = this.getWireUUID(x, y);
    return (uuid !== -1)? this.wires[uuid] : -1;
};

WireManager.prototype.hasWire = function(x, y) {
    return this.getWireUUID(x, y) !== -1;
};

WireManager.prototype.joinWires = function(uuid1, uuid2) {
    this.wires[uuid1].points = this.wires[uuid1].points.concat(this.wires[uuid2].points);
    delete this.wires[uuid2];
    this.currentUUID = uuid1;
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
            console.log(uuid);
            for (var i = 0; i < this.wires[uuid].points.length; i++) {
                var point = this.wires[uuid].points[i];
                console.log("x:" + point.x + ", y: " + point.y);
            }
        }
    }
    console.log("Total wires: " + size);
};