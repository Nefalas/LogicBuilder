ElementManager = function(basicComponentManager, wireManager) {
    this.basicComponentManager = basicComponentManager;
    this.wireManager = wireManager;
};

ElementManager.prototype.getElement = function(x, y) {
    var basicComponent = this.basicComponentManager.getComponent(x, y);
    if (basicComponent !== undefined) {
        return basicComponent;
    }
    var wire = this.wireManager.getWire(x, y);
    if (wire !== undefined) {
        return wire;
    }

    return undefined;
};

ElementManager.prototype.updateAllElements = function() {
    this.basicComponentManager.updateAllConnections();
};