
import { Node } from './node';
import { Grid } from './grid';

export function Dijkstra(start, end, grid) {
    this.start = start;
    this.end = end;
    this.grid = grid;

    this.runDijkjstra = function () {
        let graph = grid.gridArray;
        let path = [start];
        let visited = [];

        while(path.length !== 0) {
            let currentNode = getlowestDistanceNode(path);
        }

    }

    function getlowestDistanceNode(path) {
        let lowestDistanceNode = null;
        let lowestDistance = Number.MAX_SAFE_INTEGER;
        for(let node of path) {

        }
    }



}