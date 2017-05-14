// Initialize grid canvas size
var clientWidth = 0;
var clientHeight = 0;

// Grid size
var contentWidth = 4000;
var contentHeight = 2000;
// Cell size
var cellWidth = 40;
var cellHeight = 40;

// Map size
var fullMapWidth = contentWidth * .08;
var fullMapHeight = contentHeight * .08;

// Grid elements
var container = document.getElementById('grid-container');
var content = document.getElementById('grid');
var ctx = content.getContext('2d');

// Map elements
var mapContent = document.getElementById('map');
var mapCtx = mapContent.getContext('2d');

// Tools elements
var connectButton = document.getElementById("connect");

// Tools variables
var connectActive = false;

// Tools functions
function toggleConnect() {
    connectActive = !connectActive;
    connectButton.style.background = connectActive? "#96b97c" : "#30657b";
    connectButton.style.borderColor = connectActive? "#bde69e" : "#408caa";
    container.style.cursor = connectActive? "crosshair" : "move";
}

function resetWires() {
    wireManager.deleteAllWires();
    redraw();
}

function resetZoom() {
    scroller.zoomTo(1, false);
    scroller.scrollTo(0, 0, false);
}

$(".tool-img").draggable({
    helper: "clone"
});

$("#grid").droppable({
    drop: function(event, ui) {
        var x = getCellX(event.pageX);
        var y = getCellY(event.pageY);
        var type = ui.draggable[0].name;
        basicComponent.newComponent(x, y, type);
        redraw();
    }
});

// Objects
var tiling = new Tiling;
var wireManager = new WireManager;
var basicComponent = new BasicComponent;

// Render function called at every change
var render = function(left, top, zoom) {
    content.width = clientWidth;
    content.height = clientHeight;

    ctx.clearRect(0, 0, clientWidth, clientHeight);

    tiling.setup(clientWidth, clientHeight, contentWidth, contentHeight, cellWidth, cellHeight);
    tiling.render(left, top, zoom, drawCells);
    tiling.render(left, top, zoom, drawDots);
    tiling.render(left, top, zoom, drawWires);
    tiling.render(left, top, zoom, drawBasicComponents);

    drawMap(left, top, zoom);
};

// Paint functions for cells
var drawCells = function(row, col, left, top, width, height, zoom) {
    ctx.fillStyle = (row%2 === col%2) ? "#f0f0f0" : "#fff";
    ctx.fillRect(left, top, width, height);

    ctx.strokeStyle = "#c2c2c2";
    ctx.moveTo(left, top+.5*height);
    ctx.lineTo(left+width, top+.5*height);
    ctx.moveTo(left+.5*width, top);
    ctx.lineTo(left+.5*width, top+height);
};

// Paint function for dots
var drawDots = function(row, col, left, top, width, height, zoom) {
    var wire = wireManager.getWire(col, row);
    if (wire !== -1) {
        ctx.fillStyle = wire.active? "#ff0007" : "#ff939b";
    } else {
        ctx.fillStyle = "#686868";
    }
    if (zoom > .95) {
        ctx.fillRect(left + .5*width - 2, top + .5*height - 2, 4, 4);
    } else {
        ctx.fillRect(left + .5*width - 1, top + .5*height - 1, 2, 2);
    }
};

// Draw function for wires
var drawWires = function(row, col, left, top, width, height, zoom) {

    var uuid = wireManager.getWireUUID(col, row);
    if (uuid !== -1) {
        var wire = wireManager.wires[uuid];

        ctx.strokeStyle = wire.active? "#ff0007" : "#ff939b";
        ctx.lineWidth = 2;

        if (wire.hasLeftNeighbour(col, row) || basicComponent.hasLeftComponent(col, row)) {
            ctx.moveTo(left+.5*width, top+.5*height);
            ctx.lineTo(left, top+.5*height);
        }
        if (wire.hasRightNeighbour(col, row) || basicComponent.hasRightComponent(col, row)) {
            ctx.moveTo(left+.5*width, top+.5*height);
            ctx.lineTo(left+width, top+.5*height);
        }
        if (wire.hasTopNeighbour(col, row) || basicComponent.hasTopComponent(col, row)) {
            ctx.moveTo(left+.5*width, top+.5*height);
            ctx.lineTo(left+.5*width, top);
        }
        if (wire.hasBottomNeighbour(col, row) || basicComponent.hasBottomComponent(col, row)) {
            ctx.moveTo(left+.5*width, top+.5*height);
            ctx.lineTo(left+.5*width, top+height);
        }
    }
};

var drawBasicComponents = function(row, col, left, top, width, height, zoom) {
    var uuid = basicComponent.getComponentUUID(col, row);
    if (uuid !== -1) {
        var image = basicComponent.getImage(uuid);
        if (basicComponent.isImageLoaded(uuid)) {
            ctx.drawImage(image, left, top, cellWidth * zoom, cellHeight * zoom);
        } else {
            image.onload = function() {
                basicComponent.setImageLoaded(uuid, true);
                ctx.drawImage(image, left, top, cellWidth * zoom, cellHeight * zoom);
            };
        }
    }
};

// Draw function for map
var drawMap = function(left, top, zoom) {
    var mapLeft = (left*.08)/zoom;
    var mapTop = (top*.08)/zoom;
    var mapWidth = (clientWidth*.08)/zoom;
    var mapHeight = (clientHeight*.08)/zoom;

    mapCtx.clearRect(0, 0, fullMapWidth, fullMapHeight);
    mapCtx.fillStyle = "#c5c5c5";
    mapCtx.fillRect(mapLeft, mapTop, mapWidth, mapHeight);
};

// Scroller object
var scroller = new Scroller(render, {
    zooming: true,
    bouncing: false,
    locking: false
});

// Setting scroller position for zooming
var rect = container.getBoundingClientRect();
scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);

// Called on resize
var reflow = function() {
    clientWidth = container.clientWidth;
    clientHeight = container.clientHeight;
    scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
};
window.addEventListener("resize", reflow, false);
reflow();

// Event listeners for zooming, scrolling and drawing
var mouseDown = false;
var connecting = false;

container.addEventListener("mousedown", function(e) {
    if (connectActive) {
        if (!connecting) {
            connecting = true;
            wireManager.addPoint(getCellX(e.pageX), getCellY(e.pageY), "red");
        }
    } else {
        scroller.doTouchStart([{
            pageX: e.pageX,
            pageY: e.pageY
        }], e.timeStamp);

        mouseDown = true;
    }
}, false);

document.addEventListener("mousemove", function(e) {
    if (connectActive) {
        if (!connecting) {
            return;
        }

        wireManager.addPointToCurrent(getCellX(e.pageX), getCellY(e.pageY));
        redraw();
    } else {
        if (!mouseDown) {
            return;
        }

        scroller.doTouchMove([{
            pageX: e.pageX,
            pageY: e.pageY
        }], e.timeStamp);

        mouseDown = true;
    }
}, false);

document.addEventListener("mouseup", function(e) {
    if (connectActive) {
        if (!connecting) {
            return;
        }

        redraw();
        connecting = false;
    } else {
        if (!mouseDown) {
            return;
        }

        scroller.doTouchEnd(e.timeStamp);

        mouseDown = false;
    }
}, false);

container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" :  "mousewheel", function(e) {
    scroller.doMouseZoom(e.detail ? (e.detail * 120) : -e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
}, false);

container.addEventListener("click", function(e) {
    var cellX = getCellX(e.pageX);
    var cellY = getCellY(e.pageY);
    var componentUUID = basicComponent.getComponentUUID(cellX, cellY);
    if (componentUUID !== -1) {
        basicComponent.activate(componentUUID);
        redraw();
    }
});

// Helpers
function redraw() {
    var left = scroller.getValues()["left"];
    var top = scroller.getValues()["top"];
    var zoom = scroller.getValues()["zoom"];
    render(left, top, zoom);
}

function getCellX(x) {
    var zoom = scroller.getValues()["zoom"];
    var left = scroller.getValues()["left"];
    return Math.floor((x - rect.left + container.clientLeft + left)/(cellWidth * zoom));
}

function getCellY(y) {
    var zoom = scroller.getValues()["zoom"];
    var top = scroller.getValues()["top"];
    return Math.floor((y - rect.top + container.clientTop + top)/(cellHeight * zoom));
}

// Testing
function test() {
    wireManager.logWires();
}
