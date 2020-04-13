
export function Dijkstra(start, end, grid) {
    this.path = [start];

    this.runDijkstra = function () {
        let graph = grid.gridArray;
        let visited = [];
        let unvisited = [];

        unvisited.push(start);

        while(unvisited.length !== 0) {
            let currentNode = getLowestDistanceNode(this.path);
            unvisited = unvisited.filter(item => item === currentNode);

            for(let node of currentNode.neighbours) {
                if(!visited.includes(node)) {
                    setMinimumDistance(this.path, node, node.weight)
                    unvisited.push(node);
                }
            }
            visited.push(currentNode);
        }
        return this.path;
    }

    function getLowestDistanceNode(path) {
        let lowestDistanceNode = start;
        let lowestDistance = Number.MAX_SAFE_INTEGER;
        for(let node of path) {
            let distance = node.distance;
            if(distance < lowestDistance) {
                lowestDistance = distance;
                lowestDistanceNode = node;
            }
        }
        return lowestDistanceNode;
    }


    function setMinimumDistance(path, node, weight) {
        let startDistance = start.distance;
        if(startDistance + weight < node.distance) {
            node.distance = startDistance + weight;
            path.push(node);
        }
    }



}