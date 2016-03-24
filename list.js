/* Node */

function Node(data){
    this.data = data;
    this.next = null;
}


/* Linked List */

function LinkedList(){
    this.length = 0;
    this.firstNode = null;
}

/* Remove node at {position} */
LinkedList.prototype.removeNodeAt = function(position){
    var currentNode = this.firstNode,
        count = 0,
        beforeNodeToDelete = null,
        nodeToDelete = null,
        deletedNode = null;
    
    //if the {position} is invalid
    if(position < 0 || position > this.length){
        throw new Error("Could not find node for this position");
    }    
    
    //if the {position} is the first node
    //set a new firstNode, subtract length by one, return the deleted node
    if(position === 1){
        this.firstNode = currentNode.next;
        deletedNode = currentNode;
        currentNode = null;
        this.length--;
        
        return deletedNode;
    }
    
    //search for the node:
    //loop through all nodes until the right node is found 
    while(count < position){
        beforeNodeToDelete = currentNode;
        nodeToDelete = currentNode.next;
        count++;
    }
    
    //set the next from the node before the node to be deleted
    beforeNodeToDelete.next = nodeToDelete.next;
    deletedNode = nodeToDelete;
    nodeToDelete = null;
    this.length--;
    
    return deletedNode;
}


/* Get node at {position} */
LinkedList.prototype.getNodeAt = function(position){
    var currentNode = this.firstNode,
        count = 1;
        
    //if the {position} is invalid
    if(this.length === 0 || position < 1 || position > this.length){
        throw new Error("Could not find node for this position");
    }
    
    //search for the node:
    //loop through all the nodes until the count matches the {position}
    while(count < position){
        currentNode = currentNode.next;
        count++;
    }
    
    return currentNode;
}


/* Add a node with {data} of the new node*/
LinkedList.prototype.add = function(value){
    var newNode = new Node(value);
    var currentNode = this.firstNode;
    
    //If the list is empty:
    //set new node as first node and increment length
    if(!currentNode){
        this.firstNode = newNode;
        this.length++;
        return newNode;
    }
    
    //list is not empty:
    //loop through all the nodes until the last one is found
    //set the next node from this last node to the new node.
    while(currentNode.next){
        currentNode = currentNode.next;
    }
    currentNode.next = newNode;
    this.length++;
    
    return newNode;
}