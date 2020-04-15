
import { Grid } from './grid.js';
import { Dijkstra } from "./pathfinding/dijkstra/dijkstra.js";

$(document).ready(function () {
    let grid = new Grid($(window).width() / 30, $(window).height() / 30);
    grid.createGrid();
    //grid.logGrid();

    dijkstra(grid);

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
    });


});


/* Function which handle the path finding algorithms */

function dijkstra(grid) {
    let dijkstra = new Dijkstra(grid.getStart(), grid.getEnd());
    let path = dijkstra.runDijkstra();

    drawPath(path, 10, function (node) {
        $(`.table tr.row td.${node.row}-${node.col}`).addClass("data-visited");
    });


}

function drawPath(path, interval, callback) {
    let i = 0;
    next();
    function next() {
        if(callback(path[i]) !== false) {
            if (++i < path.length) {
                setTimeout(next, interval);
            }
        }
    }
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

        // set the variables start or end to selectedNode
        setStartEndNode(selectedNode, grid);

        newNode.state = selectedNode.state;

        // handle the html elements class's.
        $(".table tr.row td." + oldStartPosition).removeClass("data-" + selectedNode.state);
        $(".table tr.row td." + newStartPosition).addClass("data-" + selectedNode.state);

        // the node the mouse is over becomes the old node
        selectedNode = newNode;

        // set previous node to unvisited
        previousNode.state = "unvisited";

        return selectedNode;

    } else {
        return selectedNode;
    }
}

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


