
import { Node } from './node.js';

let start;
let end;

/**
 * Create a grid of size width and height.
 *
 * @param width - width of the table (number of td)
 * @param height - height of the table (number of tr)
 */
export function Grid(width, height) {
    this.width = Math.floor(width);
    this.height = Math.floor(height);
    this.gridArray = create2DArray(this.height);

    /**
     * Creates a table of size width and height.
     *
     * Adds rows to the existing table tags, then adds table data
     * to he rows. The table data does not contain anything.
     *
     */
    this.createGrid = function() {
        let tableHTML = "";
        let startPosition = "";
        let endPosition = "";
        for (let row = 0; row < this.height; row++) {
            let tableRow = `<tr class="row" id="row ${row}">`;
            for (let col = 0; col < this.width; col++) {

                // creates a new table data element
                const tdClass = row + "-" + col;
                tableRow += `<td class="data ${tdClass}">` + "</td>";

                // create unvisited node unless on start or end node positions.
                if ((row === Math.floor(this.height / 2)) && (col === Math.floor(this.width / 4))) {
                    startPosition = this.createStartNode(tdClass, row, col);

                } else if ((row === Math.floor(this.height / 2)) && (col === Math.floor(this.width * (3 / 4)))) {
                    endPosition = this.createEndNode(tdClass, row, col);

                } else {
                    this.createUnvisitedNode(tdClass, row);
                }
            }
            tableRow += "</tr>";
            tableHTML += tableRow;
        }

        this.createNodeNeighbours();

        $(".table").append(tableHTML);

        //console.log(startPosition + " - " + endPosition);
        $(".table tr.row td." + startPosition).addClass("data-start");
        $(".table tr.row td." + endPosition).addClass("data-end");
    };

    /**
     * Logs the grid information
     */
    this.logGrid = function() {
        console.log("Length: " + this.gridArray.length);
        console.log("width: " + this.width + " | height: " + this.height);
        console.log(this.gridArray);
    };

    /**
     * Creates 2D array from a given number of rows.
     *
     * @param rows
     * @returns {[]}
     */
    function create2DArray(rows) {
        const array = [];
        for (let col = 0; col < rows; col++) {
            array[col] = [];
        }
        return array;
    }

    /**
     * Splits a string which represents a position in the grid eg: 1-2
     * Then return an array containing the two numbers.
     *
     * @param position
     */
    this.getRowCol = function(position) {
        return position.split("-");
    };

    /**
     * Creates a node at the position clicked, then pushes it to the
     * grid array.
     *
     * @param tdClass
     * @param row
     */
    this.createUnvisitedNode = function(tdClass, row) {
        let node = new Node(this.getRowCol(tdClass)[0], this.getRowCol(tdClass)[1], 1, "unvisited");
        this.gridArray[row].push(node);
    };

    /**
     *  Creates a start node at the position clicked, then pushes it
     *  to the grid array.
     *
     * @param tdClass
     * @param row
     * @param col
     * @returns {string} - the position of the node.
     */
    this.createStartNode = function(tdClass, row, col) {
        let node = new Node(this.getRowCol(tdClass)[0], this.getRowCol(tdClass)[1], 1, "start");
        start = node;
        this.gridArray[row].push(node);
        return row + "-" + col;
    };

    /**
     *  Creates a end node at the position clicked, then pushes it
     *  to the grid array.
     *
     * @param tdClass
     * @param row
     * @param col
     * @returns {string} - the position of the node.
     */
    this.createEndNode = function(tdClass, row, col) {
        let node = new Node(this.getRowCol(tdClass)[0], this.getRowCol(tdClass)[1], 1, "end");
        end = node;
        this.gridArray[row].push(node);
        return row + "-" + col;
    };

    /**
     * Set the nodes neighbours.
     */
    this.createNodeNeighbours = function () {
        console.log(this.gridArray);
        console.log(this.width + " " + this.height);
        for(let row = 0; row < this.height; row++) {
            for(let col = 0; col < this.width; col++) {
                let currentNode = this.gridArray[row][col];
                currentNode.neighbours = addNeighbours(currentNode, this.width, this.height, this.gridArray);
            }
        }
    }

    /**
     * Clear the grid. Set all nodes except start and end to unvisited.
     */
    this.clearGrid = function () {
        for(let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let currentNode = this.gridArray[row][col];
                if(currentNode.state !== "start" && currentNode.state !== "end") {
                    currentNode.state = "unvisited";
                }
            }
        }
    }

    /* ----- Getters and Setters ----- */

    this.getStart = function () {
        return start;
    }

    this.getEnd = function () {
        return end;
    }

    this.setStart = function (node) {
        start = node;
    }

    this.setEnd = function (node) {
        end = node;
    }

    /**
     * Sets the given nodes neighbours. This function takes a 2D
     * array of nodes and gives the given node an array of neighbours,
     * so it creates a graph.
     *
     * @param currentNode - The current node to add neighbours too
     * @param width - The width of the grid
     * @param height - The height of the grid
     * @param gridArray - The array of nodes
     * @returns {[]} - The array of node neighbours for the current node
     */
    function addNeighbours(currentNode, width, height, gridArray) {
        let neighbours = [];

        /* Edge neighbours */
        if (currentNode.row === 0) { // top node
            if(currentNode.col === 0) { // top left
                neighbours.push(gridArray[1][0]);
                neighbours.push(gridArray[0][1]);

            } else if (currentNode.col === width-1) { // top right
                neighbours.push(gridArray[1][width-1]);
                neighbours.push(gridArray[0][width-2]);

            } else { // in-between
                neighbours.push(gridArray[0][currentNode.col+1]);
                neighbours.push(gridArray[currentNode.row+1][currentNode.col]);
                neighbours.push(gridArray[0][currentNode.col-1]);
            }

        } else if (currentNode.row === height-1) { // bottom node
            if(currentNode.col === 0) { // bottom left
                neighbours.push(gridArray[height-2][0]);
                neighbours.push(gridArray[height-1][1]);

            } else if (currentNode.col === width-1) { // bottom right
                neighbours.push(gridArray[height-1][width-2]);
                neighbours.push(gridArray[height-2][width-1]);

            } else { // in-between
                neighbours.push(gridArray[currentNode.row][currentNode.col-1]);
                neighbours.push(gridArray[currentNode.row-1][currentNode.col]);
                neighbours.push(gridArray[currentNode.row][currentNode.col+1]);
            }

        } else if (currentNode.col === 0) { // left node
            neighbours.push(gridArray[currentNode.row-1][currentNode.col]);
            neighbours.push(gridArray[currentNode.row][currentNode.col+1]);
            neighbours.push(gridArray[currentNode.row+1][currentNode.col]);

        } else if (currentNode.col === width - 1) { // right node
            neighbours.push(gridArray[currentNode.row+1][currentNode.col]);
            neighbours.push(gridArray[currentNode.row][currentNode.col-1]);
            neighbours.push(gridArray[currentNode.row-1][currentNode.col]);

        /* Non-edge neighbours */
        } else {
            neighbours.push(gridArray[currentNode.row-1][currentNode.col]);
            neighbours.push(gridArray[currentNode.row][currentNode.col+1]);
            neighbours.push(gridArray[currentNode.row+1][currentNode.col]);
            neighbours.push(gridArray[currentNode.row][currentNode.col-1]);
        }
        return neighbours;
    }


}
