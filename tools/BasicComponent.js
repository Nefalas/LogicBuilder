BasicComponent = function() {
    this.components = {};
};

BasicComponent.prototype.newComponent = function(x, y, type) {
    if (this.getComponentUUID(x, y) === -1) {
        this.components[(new UUID).generateUUID()] = {
            x: x,
            y: y,
            type: type,
            inputs: [new Point(x, y-1), new Point(x+1, y)],
            outputs: [new Point(x-1, y), new Point(x, y+1)],
            active: type === "power",
            hasSource: type === "power",
            hasGround: type === "power",
            imageSrc: "res/" + type + ".png",
            imageLoaded: false
        };
    }
};

BasicComponent.prototype.getComponentUUID = function(x, y) {
    for (var uuid in this.components) {
        if (this.components.hasOwnProperty(uuid)) {
            if (this.components[uuid].x === x && this.components[uuid].y === y) {
                return uuid;
            }
        }
    }
    return -1;
};

BasicComponent.prototype.hasComponent = function(x, y) {
    return this.getComponentUUID(x, y) !== -1;
};

BasicComponent.prototype.hasLeftComponent = function(x, y) {
    return this.hasComponent(x-1, y);
};

BasicComponent.prototype.hasRightComponent = function(x, y) {
    return this.hasComponent(x+1, y);
};

BasicComponent.prototype.hasTopComponent = function(x, y) {
    return this.hasComponent(x, y-1);
};

BasicComponent.prototype.hasBottomComponent = function(x, y) {
    return this.hasComponent(x, y+1);
};

BasicComponent.prototype.hasCloseComponent = function(x, y) {
    return this.hasLeftComponent(x, y)
        || this.hasRightComponent(x, y)
        || this.hasTopComponent(x, y)
        || this.hasBottomComponent(x, y);
};

BasicComponent.prototype.getType = function(uuid) {
    return this.components[uuid].type;
};

BasicComponent.prototype.getImage = function(uuid) {
    var src = this.components[uuid].imageSrc;
    var image = new Image();
    image.src = src;
    return image;
};

BasicComponent.prototype.isImageLoaded = function(uuid) {
    return this.components[uuid].imageLoaded;
};

BasicComponent.prototype.setImageLoaded = function(uuid, state) {
    this.components[uuid].imageLoaded = state;
};

BasicComponent.prototype.activate = function(uuid) {
    this.components[uuid].active = !this.components[uuid].active;
    var type = this.components[uuid].type;
    switch (type) {
        case "switch_open":
            this.toggleSwitch(uuid);
            break;
        case "button_open":
            break;
        case "power":
            break;
    }
};

BasicComponent.prototype.toggleSwitch = function(uuid) {
    var component = this.components[uuid];
    component.imageSrc = component.active? "res/switch_closed.png": "res/switch_open.png";
    component.imageLoaded = false;
};

