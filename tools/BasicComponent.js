BasicComponent = function() {
    this.components = {};
};

BasicComponent.prototype.newComponent = function(x, y, type) {
    if (this.getComponentUUID(x, y) === -1) {
        var component = {
            x: x,
            y: y,
            type: type
        };
        this.components[(new UUID).generateUUID()] = component;
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

BasicComponent.prototype.getComponentImage = function(uuid) {
    var type = this.components[uuid].type;
    var image = new Image();
    image.src = "res/" + type + ".png";
    return image;
};