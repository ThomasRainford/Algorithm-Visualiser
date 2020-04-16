
import { Grid } from './grid.js';
import { Dijkstra } from "./pathfinding/dijkstra/dijkstra.js";

let algorithmSelected = false;

$(document).ready(function () {
    let grid = new Grid($(window).width() / 30, $(window).height() / 30);
    grid.createGrid();
    //grid.logGrid();

    // When the mouse is dragged around the table, select the cells
    // which the mouse is over if the mouse is down.
    let isMouseDown = false;
    let selectedNode = null;
    $(".data").mousedown(function () {
        isMouseDown = true;
        selectedNode = getNode(this, grid);
        if (selectedNode.state !== "start" || selectedNode.state !== "end") {
            selectNode(this, grid);
        }

        return false;

    }).mouseover(function () {
        if (isMouseDown) {
            if (selectedNode.state === "start" || selectedNode.state === "end") {
                selectedNode = moveStartEndNode(this, grid, selectedNode);

            } else {
                selectNode(this, grid);
            }
        }
    });
    $(document).mouseup(function () {
        isMouseDown = false;
        grid.logGrid();
    });

    // Change the text of the alg-activate button to the selected dropdown menu item
    $(".dropdown-menu button").click(function () {
        let text = $(this).text();
        $(".alg-activate").text("Run " + text);
        algorithmSelected = true;
    });

    // run the selected algorithm when the run button is clicked
    $(".alg-activate").on("click", function () {
        if(algorithmSelected) {
            console.log($(this).text());
            if ($(this).text() === "Run Dijkstra") {
                dijkstra(grid);
            }
        }
    });


});


/* Function which handle the path finding algorithms */

/**
 * Runs the dijkstra algorithm and draws the output.
 *
 * @param grid
 */
function dijkstra(grid) {
    let dijkstra = new Dijkstra(grid.getStart(), grid.getEnd());
    let visited = dijkstra.runDijkstra();

    drawOutput(visited, 50, function (node) {
        if(node.state !== "start"
        && node.state !== "end"){
            $(`.table tr.row td.${node.row}-${node.col}`).addClass("data-visited");
        }
    });
    
    drawOutput(getPath(grid), 50, function(node) {
        if(node.state !== "start"
            && node.state !== "end"){
            $(`.table tr.row td.${node.row}-${node.col}`).addClass("data-path");
        }
    });


}

/**
 * Draws the output of a path finding algorithm, with the
 * delay of each node being drawn being interval.
 *
 * @param output - The output of the algorithm
 * @param interval - The time between drawing each node
 * @param callback - The callback function which draws the node
 */
function drawOutput(output, interval, callback) {
    let i = 0;
    next();
    function next() {
        if(callback(output[i]) !== false) {
            if (++i < output.length) {
                setTimeout(next, interval);
            }
        }
    }
}

function getPath(grid) {
    let path = [];
    for(let node = grid.getEnd(); node != null; node = node.previous) {
        path.push(node);
    }
    return path;
}


/* Function which handle the Grid UI */

/**
 * Checks if the node to be selected is already selected.
 * If it is then it will unselect it and sets it's status to unvisited.
 * Otherwise it will select it and set it's status to inaccessible.
 *
 * @param element - the HTML element (td)
 * @param grid - the grid array
 */
function selectNode(element, grid) {
    let node = grid.gridArray[parseInt($(element).parent().index())][parseInt($(element).index())];
    //console.log(node);
    if (node.state !== "start" && node.state !== "end") {
        if ($(element).hasClass("data-selected")) {
            $(element).removeClass("data-selected");
            node.state = "unvisited";

        } else {
            $(element).addClass("data-selected");
            node.state = "inaccessible";
        }
    }
}

/**
 * Move the selected start/end node to the position of the mouse,
 * ensuring the start/end node does not replace the other start/end
 * node.
 *
 * @param element
 * @param grid
 * @param selectedNode
 * @returns {*}
 */
function moveStartEndNode(element, grid, selectedNode) {

    // keep track of the node before the new node.
    let previousNode = selectedNode;

    // new position
    let row = parseInt($(element).parent().index());
    let col = parseInt($(element).index());

    let oldStartPosition = selectedNode.row + "-" + selectedNode.col;
    let newStartPosition = row + "-" + col;

    // get the node the mouse is over. Set its state to the state of the selected node.
    let newNode = getNode(element, grid);

    // ensure start node cannot replace end node and vice versa.
    if ((selectedNode.state === "start" && newNode.state !== "end") ||
        (selectedNode.state === "end" && newNode.state !== "start")) {

        newNode.state = selectedNode.state;

        // handle the html elements class's.
        $(".table tr.row td." + oldStartPosition).removeClass("data-" + selectedNode.state);
        $(".table tr.row td." + newStartPosition).addClass("data-" + selectedNode.state);

        // the node the mouse is over becomes the old node
        selectedNode = newNode;

        // set the variables start or end to selectedNode
        setStartEndNode(selectedNode, grid);

        // set previous node to unvisited
        previousNode.state = "unvisited";

        return selectedNode;

    } else {
        return selectedNode;
    }
}

/**
 * When the start or end node is moved then set the selected node
 * to a start or end node.
 *
 * @param selectedNode - The node selected
 * @param grid
 */
function setStartEndNode(selectedNode, grid) {
    if(selectedNode.state === "start") {
        grid.setStart(selectedNode);

    } else {
        grid.setEnd(selectedNode);
    }
}


/**
 *
 * @param element
 * @param grid
 * @returns {*}
 */
function getNode(element, grid) {
    return grid.gridArray[parseInt($(element).parent().index())][parseInt($(element).index())];
}


