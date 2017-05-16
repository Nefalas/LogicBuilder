BasicComponentManager = function() {
    this.components = {};
    this.images = {};
};

BasicComponentManager.prototype.newComponent = function(x, y, type) {
    if (!this.hasComponent(x, y)) {
        var uuid = (new UUID).generateUUID();
        var component;
        switch (type) {
            case "switch_":
                component = new Switch(x, y, uuid);
                break;
            case "button_":
                component = new Button(x, y, uuid);
                break;
            case "power":
                component = new Power(x, y, uuid);
                break;
            case "transistor":
                component = new Transistor(x, y, uuid);
                break;
        }
        this.components[uuid] = component;
    }
};

BasicComponentManager.prototype.getComponentUUID = function(x, y) {
    for (var uuid in this.components) {
        if (this.components.hasOwnProperty(uuid)) {
            if (this.components[uuid].x === x && this.components[uuid].y === y) {
                return uuid;
            }
        }
    }
    return -1;
};

BasicComponentManager.prototype.getComponent = function(x, y) {
    return this.components[this.getComponentUUID(x, y)];
};

BasicComponentManager.prototype.hasComponent = function(x, y) {
    return this.getComponentUUID(x, y) !== -1;
};

BasicComponentManager.prototype.hasLeftComponent = function(x, y) {
    return this.hasComponent(x-1, y);
};

BasicComponentManager.prototype.hasRightComponent = function(x, y) {
    return this.hasComponent(x+1, y);
};

BasicComponentManager.prototype.hasTopComponent = function(x, y) {
    return this.hasComponent(x, y-1);
};

BasicComponentManager.prototype.hasBottomComponent = function(x, y) {
    return this.hasComponent(x, y+1);
};

BasicComponentManager.prototype.loadImages = function() {
    var types = [
        "switch_false",
        "switch_true",
        "button_false",
        "button_true",
        "power",
        "transistor"
    ];
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        this.images[type] = new Image();
        this.images[type].src = "res/" + type + ".png";
    }
};

BasicComponentManager.prototype.getImage = function(uuid) {
    var type = this.components[uuid].type;
    var active = this.components[uuid].active;
    return type.includes("_")? this.images[type + active] : this.images[type];
};

BasicComponentManager.prototype.activate = function(uuid) {
    if (this.components[uuid].type.includes("_")) {
        this.components[uuid].active = !this.components[uuid].active;
    }
};

BasicComponentManager.prototype.updateConnections = function(uuid) {
    var component = this.components[uuid];
    component.inputsFrom = [];
    component.outputsTo = [];

    var i, x, y;
    for (i = 0; i < component.inputs.length; i++) {
        x = component.inputs[i].x;
        y = component.inputs[i].y;

        var inputElement = elementManager.getElement(x, y);
        if (inputElement !== undefined) {
            component.inputsFrom.push(inputElement);
        }
    }
    for (i = 0; i < component.outputs.length; i++) {
        x = component.outputs[i].x;
        y = component.outputs[i].y;

        var outputElement = elementManager.getElement(x, y);
        if (outputElement !== undefined) {
            component.outputsTo.push(outputElement);
        }
    }
};

BasicComponentManager.prototype.updateAllConnections = function() {
    for (var uuid in this.components) {
        if (this.components.hasOwnProperty(uuid)) {
            this.updateConnections(uuid);
        }
    }
};

BasicComponentManager.prototype.logBasicComponents = function() {
    for (var uuid in this.components) {
        if (this.components.hasOwnProperty(uuid)) {
            console.log("Basic component: " + uuid);
            var component = this.components[uuid];

            var i;
            console.log("   Inputs from:");
            for (i = 0; i < component.inputsFrom.length; i++) {
                var inputElement = component.inputsFrom[i];
                console.log("       └> " + inputElement.uuid)
            }
            console.log("   Outputs to:");
            for (i = 0; i < component.outputsTo.length; i++) {
                var outputElement = component.outputsTo[i];
                console.log("       └> " + outputElement.uuid)
            }
        }
    }
};