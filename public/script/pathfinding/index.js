import {Grid} from './grid.js';
import {Dijkstra} from "./dijkstra/dijkstra.js";
import {AStar} from "./astar/aStarSearch.js";

/**
 * Keeps track of when an algorithm is selected.
 *
 * @type {boolean}
 */
let algorithmSelected = false;

/**
 * Keeps track of when an algorithm has been started.
 *
 * @type {boolean}
 */
let algorithmStarted = false;

/**
 * Keeps track of when a new path is creates. This ensures
 * that when more nodes are selected or the grid is cleared,
 * the current previous path can be removed as it is no
 * longer relevant.
 *
 * @type {boolean}
 */
let newPath = false;

/**
 * The delay between node rendering.
 *
 * @type {number}
 */
let delay = 50;

/**
 * The current algorithm selected.
 *
 * @type {string}
 */
let currentAlgorithm = "";

/**
 * Stores the current path to ensure node previous attributes
 * can be safely removed.
 *
 * @type {*[]}
 */
let currentPath = [];

/**
 * The current timer.
 *
 * @type {number}
 */
let timer = undefined;


$(document).ready(function () {
    let grid = new Grid($(window).width() / 30, $(window).height() / 30);
    grid.createGrid();
    //grid.logGrid();

    // Handles all input to the grid.
    handleGridInput(grid);

    // Change the text of the alg-activate button to the selected dropdown menu item
    handleDropDown()

    // run the selected algorithm when the run button is clicked
    handleAlgActivate(grid);

    // clear the grid when button clicked.
    handleGridClear(grid);

    // clear the search when button clicked.
    handleSearchClear(grid);
});

/**
 * Handles the movement of the start and end nodes,
 * the drawing of inaccessible nodes and the hover
 * functionality.
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
    }).hover(function () {
        let node = getNode(this, grid);
        if (node.state !== "start" && node.state !== "end" && node.state !== "inaccessible") {
            $(this).css("background-color", "#c8c7c8");
        }
    }, function () {
        $(this).removeAttr("style");
    });

    $(document).mouseup(function () {
        isMouseDown = false;
        //grid.logGrid();
    });
}

/**
 * Handles the drop down menus for selecting the algorithm
 * and selecting the delay.
 */
function handleDropDown() {
    $(".algorithm-menu a").click(function () {
        let text = $(this).text();
        $(".run-alg").text("Run " + text);
        algorithmSelected = true;
    });

    $(".speed-menu a").click(function () {
        let text = $(this).text();
        $(".speed").text("Speed: " + text);
        if (text === "Slow") {
            delay = 50;
        } else if (text === "Moderate") {
            delay = 20;
        } else {
            delay = 5;
        }
    })
}

/**
 * Handle the button which activates the algorithm. After algorithm
 * has started executing, the button will then act as a play/pause
 * button.
 *
 * @param grid - The grid of nodes.
 */
function handleAlgActivate(grid) {
    $(".run-alg").on("click", function () {
        if (algorithmSelected) {
            let text = $(this).text();
            // Handle algorithm running state.
            if (text.includes("Run")) {
                clearSearch(grid);
                drawPreviousPath(grid);
                if (text === "Run Dijkstra") {
                    dijkstra(grid);
                } else if (text === "Run A* Search") {
                    aStar(grid);
                }

                // Set previous field to undefined so old previous path is removed
                // and the new one can be draw.
                currentPath.forEach(function (item) {
                    item.previous = undefined;
                });
            }
        } else {
            $(this).text("Select Algorithm");
        }
    });
}

/**
 * Handles the grid clear button.
 *
 * @param grid - The grid of nodes.
 */
function handleGridClear(grid) {
    $(".grid-clear").on("click", function () {
        if (algorithmSelected) {
            $(".run-alg").text("Run " + currentAlgorithm).removeAttr("disabled");
        }
        clearGrid(grid);
    });
}

/**
 * Handles the search clear button.
 *
 * @param grid - The grid of nodes.
 */
function handleSearchClear(grid) {
    $(".search-clear").on("click", function () {
        if (algorithmSelected) {
            $(".run-alg").text("Run " + currentAlgorithm).removeAttr("disabled");
        }
        clearSearch(grid);
    })
}


/* Functions which handle the path finding algorithms */

/**
 * Runs the dijkstra algorithm and draws the output.
 *
 * @param grid - The grid of nodes.
 */
function dijkstra(grid) {
    let dijkstra = new Dijkstra(grid.getStart(), grid.getEnd());
    let visited = dijkstra.runDijkstra();
    let path = getPath(grid);
    let fullSearch = visited.concat(path);
    currentAlgorithm = "Dijkstra";

    draw(fullSearch, delay);

    currentPath = path;
}

/**
 * Runs the A* search algorithm and draws the output.
 *
 * @param grid - The grid of nodes.
 */
function aStar(grid) {
    let aStar = new AStar(grid.getStart(), grid.getEnd());
    let visited = aStar.runAStar();
    let path = getPath(grid);
    let fullSearch = visited.concat(path);
    currentAlgorithm = "A* Search";

    draw(fullSearch, delay)

    currentPath = path;
}

/* =================================================== */

/**
 * Clears the node array and removes css classes from
 * the grid table. Completely clears the grid except
 * for the start and end nodes.
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
                .removeClass("data-selected")
                .removeClass("data-prev-path")
                .removeClass("data-prev-visited");
        }
    }
    clearTimeout(timer);
    newPath = true;
}

/**
 * Clears the node array and removes css classes from
 * the grid table. Only clears the grid of search
 * related css classes.
 *
 * @param grid - The grid of nodes.
 */
function clearSearch(grid) {
    grid.clearSearch();
    for (let row = 0; row < grid.height; row++) {
        for (let col = 0; col < grid.width; col++) {
            $(`.table tr.row td.${row}-${col}`)
                .removeClass("data-path")
                .removeClass("data-visited")
                .removeClass("data-prev-path")
                .removeClass("data-prev-visited");
        }
    }
    clearTimeout(timer);
}

/**
 * Draw the path of the current algorithm using a different css class
 * to show, when the next algorithm is run, where this algorithm's path was.
 *
 * @param grid - The grid of node.
 */
function drawPreviousPath(grid) {
    if (!newPath) {
        let path = currentPath;
        for (let i = 0; i < path.length; i++) {
            let node = path[i];
            if (node.state !== "start" && node.state !== "end") {
                $(`.table tr.row td.${node.row}-${node.col}`).addClass("data-prev-path");
            }
        }
    }
    newPath = false;
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
            let nodeElement = $(`.table tr.row td.${node.row}-${node.col}`);
            if (startPath) {
                nodeElement
                    .addClass(cssClass)
                    .removeClass("data-visited");
            } else {
                nodeElement.addClass(cssClass);

                if(nodeElement.hasClass("data-visited") && nodeElement.hasClass("data-prev-path")) {
                    nodeElement.removeClass("data-visited").removeClass("data-prev-path");
                    nodeElement.addClass("data-prev-visited");
                }

            }
        } else {
            $(".grid-clear").removeAttr("disabled");
            $(".search-clear").removeAttr("disabled");
            algorithmStarted = true;
        }
    });
    $(".grid-clear").removeAttr("disabled");
    $(".search-clear").removeAttr("disabled");
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
                $(".search-clear").attr("disabled", "disabled");
                timer = setTimeout(next, interval);
            }
        }
    }
}

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
            let node = getNode(element, grid);
            if (node.state === "unvisited") {
                $(element).addClass("data-selected");
                newPath = true;
            }
            node.state = "inaccessible";
        }
    }
}

/**
 * Move the selected start/end node to the position of the mouse,
 * ensuring the start/end node does not replace the other start/end
 * node.
 *
 * @param element - The css class.
 * @param grid - The grid of nodes.
 * @param selectedNode - Current node selected.
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

/* ======================================= */

/**
 * When the start or end node is moved then set the selected node
 * to a start or end node.
 *
 * @param selectedNode - The node selected
 * @param grid - The grid of nodes.
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


