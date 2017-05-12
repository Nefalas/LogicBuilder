/**
 * Constructor for basic components
 * @constructor Basic components object
 */
BasicComponent = function() {
    this.components = {};
};

/**
 * Creates a new basic component
 * @param x Horizontal cell position of the component
 * @param y Vertical cell position of the component
 * @param type Type of the component
 */
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

/**
 * Returns the UUID of the component at the given position, returns -1 if no component is found
 * @param x Horizontal cell position of the component
 * @param y Vertical cell position of the component
 * @returns {*} The UUID of the component if found, -1 if not
 */
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

/**
 * Informs if a component is present at the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a component is found, false if not
 */
BasicComponent.prototype.hasComponent = function(x, y) {
    return this.getComponentUUID(x, y) !== -1;
};

/**
 * Informs if a component is present on the left of the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a component is found, false if not
 */
BasicComponent.prototype.hasLeftComponent = function(x, y) {
    return this.hasComponent(x-1, y);
};

/**
 * Informs if a component is present on the right of the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a component is found, false if not
 */
BasicComponent.prototype.hasRightComponent = function(x, y) {
    return this.hasComponent(x+1, y);
};

/**
 * Informs if a component is present on the top of the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a component is found, false if not
 */
BasicComponent.prototype.hasTopComponent = function(x, y) {
    return this.hasComponent(x, y-1);
};

/**
 * Informs if a component is present on the bottom of the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a component is found, false if not
 */
BasicComponent.prototype.hasBottomComponent = function(x, y) {
    return this.hasComponent(x, y+1);
};

/**
 * Informs if a component is present close to the given position
 * @param x Horizontal cell position
 * @param y Vertical cell position
 * @returns {boolean} true if a component is found, false if not
 */
BasicComponent.prototype.hasCloseComponent = function(x, y) {
    return this.hasLeftComponent(x, y)
        || this.hasRightComponent(x, y)
        || this.hasTopComponent(x, y)
        || this.hasBottomComponent(x, y);
};

/**
 * Informs about the type of the component having the given UUID
 * @param uuid UUID of the component
 * @returns the type of the component
 */
BasicComponent.prototype.getType = function(uuid) {
    return this.components[uuid].type;
};

/**
 * Provides the Image object of the component having the given UUID
 * @param uuid UUID of the component
 * @returns {*} the Image object of the component
 */
BasicComponent.prototype.getImage = function(uuid) {
    var src = this.components[uuid].imageSrc;
    var image = new Image();
    image.src = src;
    return image;
};

/**
 * Informs about the loading state of the Image object of the component having the given UUID
 * @param uuid UUID of the component
 * @returns {boolean|*} true if the Image object is loaded, false if not
 */
BasicComponent.prototype.isImageLoaded = function(uuid) {
    return this.components[uuid].imageLoaded;
};

/**
 * Set the loading state of the Image object of the component having the given UUID
 * @param uuid UUID of the component
 * @param state true if the Image object is loaded, false if not
 */
BasicComponent.prototype.setImageLoaded = function(uuid, state) {
    this.components[uuid].imageLoaded = state;
};

/**
 * Activates the component having the given UUID
 * @param uuid UUID of the component
 */
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

/**
 * Activation function for components of type Switch
 * @param uuid UUID of the Switch component
 */
BasicComponent.prototype.toggleSwitch = function(uuid) {
    var component = this.components[uuid];
    component.imageSrc = component.active? "res/switch_closed.png": "res/switch_open.png";
    component.imageLoaded = false;
};

