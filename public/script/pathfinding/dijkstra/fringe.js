/**
 * Creates a fringe for the path finding algorithms.
 *
 * @param cost - The weight value of the node
 * @param node - The node
 * @param previous - The previous node
 * @constructor
 */
export function Fringe(cost, node, previous) {
    this.cost = parseInt(cost);
    this.node = node;
    this.previous = previous;

}