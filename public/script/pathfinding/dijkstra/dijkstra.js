
import { Fringe } from "./fringe";

export function Dijkstra(start) {
    this.path = [start];

    this.runDijkstra = function () {
        let fringes = [new Fringe(0, start, null)];
        let visited = [];

        while(fringes.length > 0) {
            let bestNode = expandFringe(fringes);

            if(!visited.includes(bestNode)) {
                visited.push(bestNode);
                this.path.push(bestNode);

                for(let neighbour of bestNode.neighbours) {
                    if(!visited.includes(neighbour)) {
                        let costToNeighbour = bestNode.cost + neighbour.weight;
                        fringes.push(new Fringe(costToNeighbour, neighbour, bestNode));
                    }
                }
            }
        }


        function expandFringe(fringes) {
            let lowestCost = Number.MAX_SAFE_INTEGER;
            let lowestNode = start;

            for(let fringe of fringes) {
                let cost = fringe.cost;
                if(cost < lowestCost) {
                    lowestCost = cost;
                    lowestNode = fringe.node;
                }
            }
            return lowestNode;
        }


    }




}