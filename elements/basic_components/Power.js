Power = function(x, y, uuid) {
    this.x = x;
    this.y = y;
    this.uuid = uuid;
    this.type = "power";

    this.hasSource = true;
    this.hasGround = true;
    this.active = true;

    this.inputsFrom = [];
    this.outputsTo = [];

    this.inputs = [
        {x: this.x, y: this.y-1},
        {x: this.x+1, y: this.y}
    ];
    this.outputs = [
        {x: this.x-1, y: this.y},
        {x: this.x, y: this.y+1}
    ];
};

Power.prototype.updateConnections = function() {
    this.inputsFrom = [];
    this.outputsTo = [];

    var i, x, y;
    for (i = 0; i < this.inputs.length; i++) {
        x = this.inputs[i].x;
        y = this.inputs[i].y;

        var inputElement = elementManager.getElement(x, y);
        if (inputElement !== undefined) {
            this.inputsFrom.push(inputElement.element);
        }
    }
    for (i = 0; i < this.outputs.length; i++) {
        x = this.outputs[i].x;
        y = this.outputs[i].y;

        var outputElement = elementManager.getElement(x, y);
        if (outputElement !== undefined) {
            this.outputsTo.push(outputElement.element);
        }
    }
};

Power.prototype.updateSource = function() {
    this.updateConnections();
};

Power.prototype.updateGround = function() {
    this.updateConnections();
};

Power.prototype.propagateSource = function() {
    this.updateSource();

    if (this.active && this.hasSource) {
        for (var i = 0; i < this.outputsTo.length; i++) {
            var element = this.outputsTo[i];
            var hadSource = element.hasSource;
            if (!hadSource) {
                element.hasSource = true;
                element.propagateSource();
            }
        }
    }
};

Power.prototype.propagateGround = function() {
    this.updateGround();

    if (this.active && this.hasGround) {
        for (var i = 0; i < this.inputsFrom.length; i++) {
            var element = this.inputsFrom[i];
            var hadGround = element.hasGround;
            if (!hadGround) {
                element.hasGround = true;
                element.propagateGround();
            }
        }
    }
};