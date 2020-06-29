import {Grid} from './grid.js';
import {Dijkstra} from "./pathfinding/dijkstra/dijkstra.js";

let algorithmSelected = false;

$(document).ready(function () {
    let grid = new Grid($(window).width() / 30, $(window).height() / 30);
    grid.createGrid();
    //grid.logGrid();

    // Handles all input to the grid.
    handleGridInput(grid);

    // Change the text of the alg-activate button to the selected dropdown menu item
    $(".dropdown-menu button").click(function () {
        let text = $(this).text();
        $(".alg-activate").text("Run " + text);
        algorithmSelected = true;
    });

    // run the selected algorithm when the run button is clicked
    $(".alg-activate").on("click", function () {
        if (algorithmSelected) {
            console.log($(this).text());
            if ($(this).text() === "Run Dijkstra") {
                dijkstra(grid);
            } else if ($(this).text() === "Run A* Search") {
                aStar(grid);
            }
            $(".alg-activate").text("Stop Algorithm");
        } else {
            $(this).text("Select Algorithm");
        }
    });

    // clear the grid when button clicked.
    $(".grid-clear").on("click", function () {
        $(".alg-activate").text("Run Dijkstra").removeAttr("disabled"); //TODO: Add variable for text value.
        clearGrid(grid);
    });


});

/**
 * Handles the movement of the start and end nodes.
 * Handles the drawing of inaccessible nodes.
 *
 * @param grid - The grid of nodes.
 */
function handleGridInput(grid) {
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
        //grid.logGrid();
    });
}

/**
 * Iterates through grid and removes all classes which are not
 * start or end.
 *
 * @param grid - The grid of nodes.
 */
function clearGrid(grid) {
    grid.clearGrid();
    for (let row = 0; row < grid.height; row++) {
        for (let col = 0; col < grid.width; col++) {
            $(`.table tr.row td.${row}-${col}`)
                .removeClass("data-path")
                .removeClass("data-visited")
                .removeClass("data-selected");
        }
    }
}


/* Functions which handle the path finding algorithms */

/**
 * Runs the dijkstra algorithm and draws the output.
 *
 * @param grid
 */
function dijkstra(grid) {
    let dijkstra = new Dijkstra(grid.getStart(), grid.getEnd());
    let visited = dijkstra.runDijkstra();
    let path = getPath(grid);

    draw(visited.concat(path), 5);

}

function aStar(grid) {

}

/* =================================================== */

/**
 * Draws the visited nodes then the path found.
 *
 * Re-enables the Clear Path button once path has been found.
 *
 * @param array - The array of nodes.
 * @param delay - The delay between each node being drawn
 */
function draw(array, delay) {
    let startPath = false;

    drawOutput(array, delay, function (node) {
        if (node.state === "start") startPath = true;

        let cssClass = setCssClass(startPath);

        if (node.state !== "start" && node.state !== "end") {
            $(`.table tr.row td.${node.row}-${node.col}`).addClass(cssClass);
        } else {
            $(".grid-clear").removeAttr("disabled");
        }


    });
    $(".grid-clear").removeAttr("disabled");

}

/**
 * Draws the output of a path finding algorithm, with the
 * delay of each node being drawn being interval.
 *
 * Disables the Clear Grid button to ensure it is not clicked
 * during the search.
 *
 * @param output - The output of the algorithm
 * @param interval - The time between drawing each node
 * @param callback - The callback function which draws the node
 */
function drawOutput(output, interval, callback) {
    let i = 0;
    next();

    function next() {
        if (callback(output[i]) !== false) {
            if (++i < output.length) {
                $(".grid-clear").attr("disabled", "disabled");
                let timer = setTimeout(next, interval);

                // Stop the timer when clicked.
                $(".alg-activate").on("click", function () {
                    $(".grid-clear").removeAttr("disabled");
                    $(this).attr("disabled", "disabled");
                    clearTimeout(timer);
                });
            }
        }
    }
}

/**
 * Creates an array which contains the nodes which are
 * part of the path found.
 *
 * @param grid
 * @returns {*[]} - Array of nodes in the path
 */
function getPath(grid) {
    let path = [];
    for (let node = grid.getEnd(); node != null; node = node.previous) {
        path.push(node);
    }
    return path.reverse();
}

/**
 * If the path has started return the name of the css class used
 * for displaying the path, otherwise return the name of the
 * css class which displays the search.
 *
 * @param startPath - If the path has started or not.
 * @returns {string} - Name of the css class.
 */
function setCssClass(startPath) {
    if (startPath) {
        return "data-path";
    } else {
        return "data-visited";
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
    if (selectedNode.state === "start") {
        grid.setStart(selectedNode);

    } else {
        grid.setEnd(selectedNode);
    }
}


/**
 *  Gets a node from the grid.
 *
 * @param element - The html table element clicked on.
 * @param grid - The grid of node.
 * @returns {*} - A node.
 */
function getNode(element, grid) {
    return grid.gridArray[parseInt($(element).parent().index())][parseInt($(element).index())];
}


