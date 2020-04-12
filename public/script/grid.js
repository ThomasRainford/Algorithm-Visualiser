
import { Node } from './node.js';

/**
 * Create a grid of size width and height.
 *
 * @param width - width of the table (number of td)
 * @param height - height of the table (number of tr)
 */
export function Grid(width, height) {
    this.width = width;
    this.height = height;
    this.gridArray = create2DArray(height);

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
        $(".table").append(tableHTML);

        //console.log(startPosition + " - " + endPosition);
        $(".table tr.row td." + startPosition).addClass("data-start");
        $(".table tr.row td." + endPosition).addClass("data-end");
    };

    /**
     * Logs the grid information
     */
    Grid.prototype.logGrid = function() {
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
    Grid.prototype.getRowCol = function(position) {
        return position.split("-");
    };

    /**
     * Creates a node at the position clicked, then pushes it to the
     * grid array.
     *
     * @param tdClass
     * @param row
     */
    Grid.prototype.createUnvisitedNode = function(tdClass, row) {
        let node = new Node(this.getRowCol(tdClass)[0], this.getRowCol(tdClass)[1], 0, "unvisited");
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
    Grid.prototype.createStartNode = function(tdClass, row, col) {
        let node = new Node(this.getRowCol(tdClass)[0], this.getRowCol(tdClass)[1], 0, "start");
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
    Grid.prototype.createEndNode = function(tdClass, row, col) {
        let node = new Node(this.getRowCol(tdClass)[0], this.getRowCol(tdClass)[1], 0, "end");
        this.gridArray[row].push(node);
        return row + "-" + col;
    };

    Grid.prototype.createNodeNeighbours = function () {
        for(let row = 0; row < this.height; row++) {

            for(let col = 0; col < this.width; col++) {
                let currentNode = this.gridArray[row][col];

                currentNode.neighbours = addEdgeNeighbours(currentNode, this.width, this.height, this.gridArray);


            }

        }
    }

    function addEdgeNeighbours(currentNode, width, height, gridArray) {
        let neighbours = [];
        if (currentNode.row === 0) { // top node
            if(currentNode.col === 0) { // top left
                neighbours.push(gridArray[1][0]);
                neighbours.push(gridArray[1][1]);
                neighbours.push(gridArray[0][1]);

            } else if (currentNode.col === width-1) { // top right
                neighbours.push(gridArray[width-1][1]);
                neighbours.push(gridArray[width-2][1]);
                neighbours.push(gridArray[width-2][0]);

            } else { // in-between
                neighbours.push(gridArray[currentNode.col+1][0]);
                neighbours.push(gridArray[currentNode.col+1][currentNode.row+1]);
                neighbours.push(gridArray[currentNode.col][currentNode.row+1]);
                neighbours.push(gridArray[currentNode.col-1][currentNode.row+1]);
                neighbours.push(gridArray[currentNode.col-1][0]);
            }

        } else if (currentNode.row === height-1) { // bottom node
            if(currentNode.col === 0) { // bottom left

            } else if (currentNode.col === width-1) { // bottom right

            } else { // in-between

            }

        } else if (currentNode.col === 0) { // left node


        } else if (currentNode.col === width - 1) { // right node

        }
        return neighbours;
    }


}