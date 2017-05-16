Point = function(x, y) {
    this.x = x;
    this.y = y;
    this.left = undefined;
    this.right = undefined;
    this.top = undefined;
    this.bottom = undefined;
};

Point.prototype.updateNeighbours = function(wire) {
    var left = wire.getLeftNeighbour(this.x, this.y);
    var right = wire.getRightNeighbour(this.x, this.y);
    var top = wire.getTopNeighbour(this.x, this.y);
    var bottom = wire.getBottomNeighbour(this.x, this.y);

    if (left !== undefined) {
        this.left = left;
    }
    if (right !== undefined) {
        this.right = right;
    }
    if (top !== undefined) {
        this.top = top;
    }
    if (bottom !== undefined) {
        this.bottom = bottom;
    }
    wire.removeFirstOccurrences(this.x, this.y);
};

Point.prototype.updateNeighboursNeighbours = function(wire) {
    if (this.left !== undefined) {
        this.left.updateNeighbours(wire);
    }
    if (this.right !== undefined) {
        this.right.updateNeighbours(wire);
    }
    if (this.top !== undefined) {
        this.top.updateNeighbours(wire);
    }
    if (this.bottom !== undefined) {
        this.bottom.updateNeighbours(wire);
    }
};