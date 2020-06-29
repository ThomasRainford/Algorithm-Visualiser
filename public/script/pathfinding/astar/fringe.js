/**
 * Creates a Fringe for the A* search path finding
 * algorithm.
 *
 * @param node - The current node
 * @param previous - The previous node
 * @param g - Cost from the start
 * @param f - Sum of the cost from the start
 *            and the estimated cost to the goal.
 * @constructor
 */
export function Fringe(node, previous, g, f) {
    this.node = node;
    this.previous = previous;
    this.g = g;
    this.f = f;
}
