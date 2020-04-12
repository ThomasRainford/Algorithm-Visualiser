/**
* Create a node in a position in the grid.
*
* @param row
* @param col
* @param weight
* @param state
*/
export function Node(row, col, weight, state) {
    this.row = row;
    this.col = col;
    this.weight = weight;
    this.state = state;
    this.neighbours = [];
}