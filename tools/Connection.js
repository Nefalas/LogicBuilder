Connection = function() {
    this.wires = {};
    this.current = "";
};

Connection.prototype.newWire = function(x, y) {
    var wireName = generateUUID();
    this.current = wireName;
    this.wires[wireName] = [new Point(x, y)];
};

Connection.prototype.addPoint = function(x, y) {
    var lastPoint = this.wires[this.current][this.wires[this.current].length-1];
    if (!(lastPoint.getX() === x && lastPoint.getY() === y)) {
        this.wires[this.current].push(new Point(x, y));
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

Connection.prototype.hasWire = function(x, y) {
    for (var name in this.wires) {
        if (this.wires.hasOwnProperty(name)) {
            for (var i = 0; i < this.wires[name].length; i++) {
                var point = this.wires[name][i];
                if (point.getX() === x && point.getY() === y) {
                    return true;
                }
            }
        }
    }
    return false;
};

Connection.prototype.checkCurrent = function() {
    if (this.wires[this.current].length === 1) {
        delete this.wires[this.current];
        this.current = "";
    }
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

function generateUUID() {
    var d = new Date().getTime();
    return uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
}