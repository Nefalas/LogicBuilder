Point = function(x, y) {
    this.x = x;
    this.y = y;

    this.hasSource = false;
    this.hasGround = false;
    this.active = false;

    this.neighbours = {
        left: undefined,
        right: undefined,
        top: undefined,
        bottom: undefined
    };
};

Point.prototype.updateNeighbours = function(wire) {
    var left = wire.getLeftNeighbour(this.x, this.y);
    var right = wire.getRightNeighbour(this.x, this.y);
    var top = wire.getTopNeighbour(this.x, this.y);
    var bottom = wire.getBottomNeighbour(this.x, this.y);

    if (left !== undefined) {
        this.neighbours.left = left;
    }
    if (right !== undefined) {
        this.neighbours.right = right;
    }
    if (top !== undefined) {
        this.neighbours.top = top;
    }
    if (bottom !== undefined) {
        this.neighbours.bottom = bottom;
    }

    wire.removeFirstOccurrences(this.x, this.y);
};

Point.prototype.updateNeighboursNeighbours = function(wire) {
    if (this.neighbours.left !== undefined) {
        this.neighbours.left.updateNeighbours(wire);
    }
    if (this.neighbours.right !== undefined) {
        this.neighbours.right.updateNeighbours(wire);
    }
    if (this.neighbours.top !== undefined) {
        this.neighbours.top.updateNeighbours(wire);
    }
    if (this.neighbours.bottom !== undefined) {
        this.neighbours.bottom.updateNeighbours(wire);
    }
};

Point.prototype.updateConnections = function() {
    if (this.neighbours.left === undefined) {
        var left = elementManager.getElement(this.x-1, this.y);
        if (left !== undefined && left.type !== "point") {
            this.neighbours.left = left.element;
        }
    }
    if (this.neighbours.right === undefined) {
        var right = elementManager.getElement(this.x+1, this.y);
        if (right !== undefined && right.type !== "point") {
            this.neighbours.right = right.element;
        }
    }
    if (this.neighbours.top === undefined) {
        var top = elementManager.getElement(this.x, this.y-1);
        if (top !== undefined && top.type !== "point") {
            this.neighbours.top = top.element;
        }
    }
    if (this.neighbours.bottom === undefined) {
        var bottom = elementManager.getElement(this.x, this.y+1);
        if (bottom !== undefined && bottom.type !== "point") {
            this.neighbours.bottom = bottom.element;
        }
    }
};

Point.prototype.updateSource = function() {
    this.updateConnections();
    this.hasSource = false;

    for (var position in this.neighbours) {
        if (this.neighbours.hasOwnProperty(position)) {
            var element = this.neighbours[position];
            if (element !== undefined && element.hasSource) {
                this.hasSource = true;
            }
        }
    }

    this.active = this.hasGround && this.hasSource;
};

Point.prototype.updateGround = function() {
    this.updateConnections();
    this.hasGround = false;

    for (var position in this.neighbours) {
        if (this.neighbours.hasOwnProperty(position)) {
            var element = this.neighbours[position];
            if (element !== undefined && element.hasGround) {
                this.hasGround = true;
            }
        }
    }

    this.active = this.hasGround && this.hasSource;
};

Point.prototype.propagateSource = function() {
    this.updateSource();

    if (this.hasSource) {
        for (var position in this.neighbours) {
            if (this.neighbours.hasOwnProperty(position)) {
                var element = this.neighbours[position];
                if (element !== undefined) {
                    var hadSource = element.hasSource;
                    if (!hadSource) {
                        element.hasSource = true;
                        element.propagateSource();
                    }
                }
            }
        }
    }
};

Point.prototype.propagateGround = function() {
    this.updateGround();

    if (this.hasSource) {
        for (var position in this.neighbours) {
            if (this.neighbours.hasOwnProperty(position)) {
                var element = this.neighbours[position];
                if (element !== undefined) {
                    var hadGround = element.hasGround;
                    if (!hadGround) {
                        element.hasGround = true;
                        element.propagateGround();
                    }
                }
            }
        }
    }
};