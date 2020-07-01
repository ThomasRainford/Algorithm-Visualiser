/**
 * Creates a fringe for the Dijkstra path finding algorithm.
 *
 * @param cost - The weight value of the node
 * @param node - The current node
 * @param previous - The previous node
 * @constructor
 */
export function Fringe(cost, node, previous) {
    this.cost = parseInt(cost);
    this.node = node;
    this.previous = previous;

}
