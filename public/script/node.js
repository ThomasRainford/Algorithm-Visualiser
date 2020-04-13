/**
* Create a node in a position in the grid.
*
* @param row
* @param col
* @param weight
* @param state
*/
export function Node(row, col, weight, state) {
    this.row = parseInt(row);
    this.col = parseInt(col);
    this.weight = parseInt(weight);
    this.state = state;
    this.neighbours = [];
    this.distance = Number.MAX_SAFE_INTEGER;
}