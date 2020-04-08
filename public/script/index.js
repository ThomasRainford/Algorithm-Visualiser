// class Node {
//
//     /**
//      * Create a node in a position in the grid.
//      *
//      * @param row
//      * @param col
//      * @param weight
//      * @param state
//      */
//     constructor(row, col, weight, state) {
//         this.row = row;
//         this.col = col;
//         this.weight = weight;
//         this.state = state;
//     }
// }
//
//
// class Grid {
//
//     /**
//      * Create a grid of size width and height.
//      *
//      * @param width - width of the table (number of td)
//      * @param height - height of the table (number of tr)
//      */
//     constructor(width, height) {
//         this.width = width;
//         this.height = height;
//         this.gridArray = this.create2DArray(height);
//         this.createGrid();
//     }
//
//     /**
//      * Creates a table of size width and height.
//      *
//      * Adds rows to the existing table tags, then adds table data
//      * to he rows. The table data does not contain anything.
//      *
//      */
//     createGrid() {
//         let tableHTML = "";
//         let startPosition = "";
//         let endPosition = "";
//         for (let row = 0; row < this.height; row++) {
//             let tableRow = `<tr class="row" id="row ${row}">`;
//             for (let col = 0; col < this.width; col++) {
//
//                 // creates a new table data element
//                 const tdClass = row + "-" + col;
//                 tableRow += `<td class="data ${tdClass}">` + "</td>";
//
//                 // create unvisited node unless on start or end node positions.
//                 if ((row === Math.floor(this.height / 2)) && (col === Math.floor(this.width / 4))) {
//                     startPosition = this.createStartNode(tdClass, row, col);
//
//                 } else if ((row === Math.floor(this.height / 2)) && (col === Math.floor(this.width * (3 / 4)))) {
//                     endPosition = this.createEndNode(tdClass, row, col);
//
//                 } else {
//                     this.createUnvisitedNode(tdClass, row);
//                 }
//
//
//             }
//             tableRow += "</tr>";
//             tableHTML += tableRow;
//         }
//         $(".table").append(tableHTML);
//
//         //console.log(startPosition + " - " + endPosition);
//         $(".table tr.row td." + startPosition).addClass("data-start");
//         $(".table tr.row td." + endPosition).addClass("data-end");
//     }
//
//
//     /**
//      * Logs the grid information
//      */
//     logGrid() {
//         console.log("Length: " + this.gridArray.length);
//         console.log("width: " + this.width + " | height: " + this.height);
//         console.log(this.gridArray);
//     }
//
//     /**
//      * Creates 2D array from a given number of rows.
//      *
//      * @param rows
//      * @returns {[]}
//      */
//     create2DArray(rows) {
//         const array = [];
//         for (let col = 0; col < rows; col++) {
//             array[col] = [];
//         }
//         return array;
//     }
//
//     /**
//      * Splits a string which represents a position in the grid eg: 1-2
//      * Then return an array containing the two numbers.
//      *
//      * @param position
//      */
//     getRowCol(position) {
//         return position.split("-");
//     }
//
//     /**
//      * Creates a node at the position clicked, then pushes it to the
//      * grid array.
//      *
//      * @param tdClass
//      * @param row
//      */
//     createUnvisitedNode(tdClass, row) {
//         let node = new Node(this.getRowCol(tdClass)[0], this.getRowCol(tdClass)[1], 0, "unvisited");
//         this.gridArray[row].push(node);
//     }
//
//     /**
//      *  Creates a start node at the position clicked, then pushes it
//      *  to the grid array.
//      *
//      * @param tdClass
//      * @param row
//      * @param col
//      * @returns {string} - the position of the node.
//      */
//     createStartNode(tdClass, row, col) {
//         let node = new Node(this.getRowCol(tdClass)[0], this.getRowCol(tdClass)[1], 0, "start");
//         this.gridArray[row].push(node);
//         return row + "-" + col;
//     }
//
//     /**
//      *  Creates a end node at the position clicked, then pushes it
//      *  to the grid array.
//      *
//      * @param tdClass
//      * @param row
//      * @param col
//      * @returns {string} - the position of the node.
//      */
//     createEndNode(tdClass, row, col) {
//         let node = new Node(this.getRowCol(tdClass)[0], this.getRowCol(tdClass)[1], 0, "end");
//         this.gridArray[row].push(node);
//         return row + "-" + col;
//     }
// }

import { Grid } from './grid';

$(document).ready(function () {
    let grid = Grid($(window).width() / 30, $(window).height() / 30);
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
    });


    // /* TEST: test selecting one td */
    // // const td = "0-0";
    // // $(".table tr.row td." + td).addClass("data-selected");
    //
    // /* TEST: Testing iterating over table to add/remove a td class */
    // // class: button-fill
    // $(".button-fill").on("click", function () {
    //     $(".table tr.row td.data").each(function () {
    //         //selectNode(this, false, grid);
    //     });
    // });
    //
    // // class: button-clear
    // $(".button-clear").on("click", function () {
    //     $(".table tr.row td.data").each(function () {
    //         //selectNode(this, true, grid);
    //     });
    // });


});


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

        // set previous node to unvisited
        previousNode.state = "unvisited";

        return selectedNode;

    } else {
        return selectedNode;
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


