Button = function(x, y, uuid) {
    this.x = x;
    this.y = y;
    this.uuid = uuid;
    this.type = "button_";
    this.active = false;

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
