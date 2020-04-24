
import { Fringe } from "./fringe.js";

export function Dijkstra(start, end) {
    this.visited = [];

    /**
     * Carry's out the logic for the Dijkstra algorithm.
     *
     * @returns {[]} - An array of each node visited.
     */
    this.runDijkstra = function () {
        let fringes = [new Fringe(0, start, null)];

        while (fringes.length > 0) {
            let bestFringe = expandFringe(fringes);

            if (canVisit(bestFringe.node, this.visited)) {
                this.visited.push(bestFringe.node);

                if(bestFringe.previous !== null)
                 bestFringe.node.previous = bestFringe.previous;

                if (bestFringe.node === end) {
                    return setVisited(this.visited);
                }

                for (let neighbour of bestFringe.node.neighbours) {
                    if (!this.visited.includes(neighbour)) {
                        let costToNeighbour = bestFringe.cost + neighbour.weight;
                        fringes.push(new Fringe(costToNeighbour, neighbour, bestFringe.node));
                    }
                }
            }
        }
    }

    /**
     * Evaluated the fringe fields and determines the
     * best node for the algorithm to visit next.
     *
     * @param fringes - The array of fringes
     * @returns {Fringe} - The fringe which contains
     *                      the best node to visit next
     */
    function expandFringe(fringes) {
        let lowestCost = Number.MAX_SAFE_INTEGER;
        let bestFringe = fringes[0];

        for(let fringe of fringes) {
            let cost = fringe.cost;
            if(cost < lowestCost) {
                lowestCost = cost;
                bestFringe = fringe;
            }
        }
        fringes.splice(fringes.indexOf(bestFringe), 1);
        return bestFringe;
    }

    /**
     * Determines whether a given node can be visited.
     *
     * @param node - The node to visit
     * @param visited - The array of visited nodes
     * @returns {boolean|boolean} - If the node is visitable
     */
    function canVisit(node, visited) {
        return !visited.includes(node)
            && node.state !== "inaccessible";
    }

    /**
     * Sets the nodes states in the visited array to
     * 'visited'.
     *
     * @param visited - The array of visited nodes.
     * @returns {*} - The array of visited node minus
     *                the start and end nodes.
     */
    function setVisited(visited) {
        visited = visited.filter(item => item !== start);
        visited = visited.filter(item => item !== end);

        for(let node of visited) {
            node.state = "visited";
        }
        return visited;
    }


}