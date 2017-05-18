ElementManager = function(basicComponentManager, wireManager) {
    this.basicComponentManager = basicComponentManager;
    this.wireManager = wireManager;
};

ElementManager.prototype.getElement = function(x, y) {
    var basicComponent = this.basicComponentManager.getComponent(x, y);
    if (basicComponent !== undefined) {
        return {
            element: basicComponent,
            type: "basicComponent"
        };
    }
    var wire = this.wireManager.getWire(x, y);
    if (wire !== undefined) {
        var point = wire.getPoint(x, y);
        return {
            element: point,
            type: "point"
        };
    }

    return undefined;
};
