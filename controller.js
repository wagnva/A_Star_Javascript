var $objects = $objects || {},
    map = [],
    aStar = null,
    currentNode = null,
    currentlyDrawingCalculating = false;

$(document).ready(function(){
   
    //jquery objects
    $objects.$table = $("main table");
    $objects.$gridSize = $("main .controls #controls-gridsize");
    $objects.$frequency = $("main .controls #controls-frequency");
    $objects.$diagonal = $("main .controls #controls-diagonal");
    $objects.$sucess = $("main .controls #controls-infos-success");
    $objects.$failed = $("main .controls #controls-infos-failed");
    $objects.$displaymode = $("main .controls #controls-displaymode");
    
    //create the standart grid and create the algorithm object
    createGrid($objects.$table, $objects.$gridSize.val());
    aStar = new a_star(map, $objects.$diagonal.is(":checked"));
    
    
    //controlls-generate setup onclick listener
    $("main .controls #controls-generate").on("click", controllsGenerate);
    
    //check if checkbox is checked and change diagonal setting of the aStar object
    $objects.$diagonal.change(function(){
       aStar.setDiagonal($objects.$diagonal.is(":checked"));
    });
    
});

function cellListener(event){
    var gridX = $(this).attr("data-x"),
        gridY = $(this).attr("data-y"),
        node = map[gridX][gridY];
    
    //console.log("Clicked on Cell at X:" + node.data.x + ", Y: " + node.data.y);
    if(!node.data.isWall || !currentlyDrawingCalculating){
        
        currentlyDrawingCalculating = true;
        var time = window.performance.now();
        var path = aStar.search(currentNode, node);
        time = window.performance.now() - time;
        updateAlgorithmInfos(path, time);
        if(path.length > 0){
            showPath(path);
        }
        
    }
}

function updateAlgorithmInfos(path, time){
    $objects.$failed.css("display", "none");
    $objects.$sucess.css("display", "none");
    if(path.length === 0){
        $objects.$failed.css("display", "block");
    }else{
        $objects.$sucess.css("display", "block");
        $objects.$sucess.find("span").text(time);
    }
}

function showPath(path){
    //remove old Path
    $("[data-path=true]").attr("data-path","false");
    
    var timestep = 500;
    for(var i = 0; i < path.length; i++){
        //console.log("[data-x=" + node.data.x + "][data-y=" + node.data.y + "]");
        if(!$objects.$displaymode.is(":checked")){
            showNode(path[i], timestep, i, 1);
        }else{
            showNode(path[i], timestep * 5, 0, 0);
        }
    }
    
    var lastNode = path[path.length-1];
    setupCurrentNode(lastNode.data.x, lastNode.data.y, timestep * 2);
    currentlyDrawingCalculating = false;
    
}

function showNode(node, timestep, i, j){
    //{i} = the current Interval
    //{j} = 2nd multiplier for the 2nd display mode
    setTimeout(function(){
            $("[data-x=" + node.data.x + "][data-y=" + node.data.y + "]").attr("data-path", "true");
            
            setTimeout(function(){
                $("[data-x=" + node.data.x + "][data-y=" + node.data.y + "]").attr("data-path", "false");
            }, timestep);
            
        }, timestep * (1 + i * 0.10) * j);
}

function controllsGenerate(event){
    var size = ($objects.$gridSize.val() <= 100)? $objects.$gridSize.val() : 100;
    createGrid($objects.$table, size);
}

function recalcGridSize($table, gridSize){
    
    /* calculate the new cell size */
    var cellSize = 30;
    var gridWidth = ($("main .container .two-thirds.column").width() / gridSize) -2;
    
    $table.find("td").css("min-width", gridWidth).css("height", gridWidth);
    
}

function createGrid($table, gridSize){
    
    $table.empty();
    
    /* add all the cells to the grid*/
    var toAdd = "";
    var isWall = false;
    
    /* setup the map */
    map = new Array(gridSize);
    for(var i = 0; i < gridSize; i++){
        map[i] = new Array(gridSize);
    }
    
    for(var y = 0; y < gridSize; y++){
        toAdd += "<tr>";
        for(var x = 0; x < gridSize; x++){
            isWall = (Math.floor(Math.random()*(1/$objects.$frequency.val()))) === 0;
            toAdd += "<td data-x='" + x + "' data-y='" + y + "' data-wall='" + isWall + "'></td>"; 
            map[x][y] = new Node({
                x: x,
                y: y,
                isWall: isWall,
                parent: null,
                closed: false,
                h: 0,
                g: 0,
                f: 0
            });
            
        }
        toAdd += "</tr>";
    }
    
    $table.append(toAdd);
    
    if(aStar){
        aStar.setMap(map);
    }
    
    //apply clicklistener to all the table cells
    $objects.$table.find("td").on("click", cellListener);
    
    //setup current node at the middle of the grid at the creation of a new grid
    var currPos = Math.round(gridSize/2);
    setupCurrentNode(currPos, currPos);
    
    //Calc and apply the gridcellsize
    recalcGridSize($table, gridSize);
    
}

function setupCurrentNode(_x, _y, when){
    //{when} = when the old current node should be removed
    //remove the data attribute from the old current Node if there is one 
    if(currentNode){
        var oldCurrentNodeCell = $("[data-x=" + currentNode.data.x + "][data-y=" + currentNode.data.y + "]");
        setTimeout(function(){
            oldCurrentNodeCell.attr("data-current", "false");
        }, when);
    }
    
    //get the current node based from the position and add the data attribute
    currentNode = map[_x][_y];
    $("[data-x=" + _x + "][data-y=" + _y + "]").attr("data-current", "true");
}

