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

BasicComponent.prototype.getComponentImage = function(uuid) {
    var type = this.components[uuid].type;
    var image = new Image();
    image.src = "res/" + type + ".png";
    return image;
};