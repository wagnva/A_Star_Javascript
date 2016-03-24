/* A single Node */
function Node(data){
    this.data = data;
    this.getF = function(){
        return this.data.g + this.data.h;
    }
}

/* Add a Contains method to the array */
if(!Array.prototype.contains){
    Array.prototype.contains = function(object){
        return this.indexOf(object) != -1;
    }
}

/* The actual algorith object */
a_star = function(map, diagonal){
    this.map = map || [];
    this.diagonal = diagonal || false;
}

a_star.prototype.setMap = function(map){
    this.map = map;
}

a_star.prototype.setDiagonal = function(diagonal){
    this.diagonal = diagonal;
}

//reset the node.data.closed value
a_star.prototype.init = function(){
    for(var x = 0; x < this.map.length; x++){
        for(var y = 0; y < this.map.length; y++){
            var node = this.map[x][y];
            node.data.closed = false;
        }
    }
}

a_star.prototype.search = function(startNode, targetNode){
    this.init();
    
    var openList = [];
    openList.push(startNode);
    
    while(openList.length > 0){
        
        /* Find node with the lowest f cost */
        var currentNode = openList[0];
        for(var i = 1; i < openList.length; i++){
            if(openList[i].getF() < currentNode.getF() || openList[i].getF() === currentNode.getF() && openList[i].data.h < currentNode.data.h){
                currentNode = openList[i];
            }
        }
        
        openList.splice(openList.indexOf(currentNode), 1);
        currentNode.data.closed = true;
        
        if(currentNode === targetNode){
            return this.retracePath(startNode, targetNode);
        }
        
        var neighbors = this.getNeighbors(currentNode, this.diagonal),
            neighbor = null;
        
        console.log(neighbors.length);
        
        for(var i = 0; i < neighbors.length; i++){
            neighbor = neighbors[i];
            
            if(neighbor.data.isWall || neighbor.data.closed){
                console.log("continue");
                console.log(neighbor.data.isWall);
                console.log(neighbor.data.closed);
                continue;
            }
            
            var newMovCost = currentNode.data.g + this.getDistance(currentNode, neighbor);
            if(newMovCost < neighbor.data.g || !openList.contains(neighbor)){
                neighbor.data.g = newMovCost;
                neighbor.data.h = this.getDistance(neighbor, targetNode);
                neighbor.data.parent = currentNode;
                
                if(!openList.contains(neighbor)){
                    openList.push(neighbor);
                }
            }
            
        }
    }
    
    return [];
}

a_star.prototype.retracePath = function(startNode, targetNode){
    var path = [],
        currentNode = targetNode;
    
    while(currentNode !== startNode){
        path.push(currentNode);
        currentNode = currentNode.data.parent;
    }
    
    return path.reverse();
}


a_star.prototype.getDistance = function(pos1, pos2){
    var difX = Math.abs(pos1.data.x - pos2.data.x);
    var difY = Math.abs(pos1.data.y - pos2.data.y);
    
    if(difX > difY){
        return 14*difY + 10 * (difX-difY);
    }
    return 14*difX + 10 * (difY - difX);
}

a_star.prototype.getNeighbors = function(node, diagonal){
    
    if(diagonal){
        var neighbors = [];

        for(var x = -1; x <= 1; x++){
            for(var y = -1; y <= 1; y++){

                if(x === 0 && y === 0){
                    continue;
                }


                var checkX = node.data.x + x,
                    checkY = node.data.y + y;

                if(checkX >= 0 && checkX < map.length && checkY >= 0 && checkY < map.length){
                    neighbors.push(map[checkX][checkY]);
                }
            }
        }

        return neighbors;
    }
    else{

        var temp = [],
            x = node.data.x,
            y = node.data.y;

        if(this.map[x-1] && this.map[x-1][y]){
            temp.push(this.map[x-1][y]);
        }
        if(this.map[x+1] && this.map[x+1][y]){
            temp.push(this.map[x+1][y]);
        }

        if(this.map[x][y-1]){
            temp.push(this.map[x][y-1]);
        }
        if(this.map[x][y+1]){
            temp.push(this.map[x][y+1]);
        }

        return temp; 
        
    }
}