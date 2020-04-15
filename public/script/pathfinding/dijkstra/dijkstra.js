
import { Fringe } from "./fringe.js";

export function Dijkstra(start, end) {
    this.path = [];

    this.runDijkstra = function () {
        let fringes = [new Fringe(0, start, null)];
        let visited = [];

        while (fringes.length > 0) {
            let bestFringe = expandFringe(fringes);

            if (canVisit(bestFringe.node, visited)) {
                visited.push(bestFringe.node);

                if(bestFringe.previous !== null
                && bestFringe.node !== end) this.path.push(bestFringe.node);

                if (bestFringe.node === end) {
                    return this.path;
                }

                for (let neighbour of bestFringe.node.neighbours) {
                    if (!visited.includes(neighbour)) {
                        let costToNeighbour = bestFringe.cost + neighbour.weight;
                        fringes.push(new Fringe(costToNeighbour, neighbour, bestFringe.node));
                    }
                }
            }
        }
    }

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
    
    function canVisit(node, visited) {
        return !visited.includes(node)
            && node.state !== "inaccessible";
    }


}