var row;
var col;
var bombs;
var game;
var bombCoords = [];
var omniDirection = [
    {x:0, y:-1}, 
    {x:0, y:1}, 
    {x:-1, y:0}, 
    {x:1, y:0}, 
    {x:-1, y:-1}, 
    {x:1, y:1}, 
    {x:-1, y:1}, 
    {x:1, y:-1} 
]
var firstClick = true;
var aiGrid;
var shownBorderTiles;
var hiddenBorderTiles;


// 
function createNode(type, parent){
    var newNode = document.createElement(type);
    parent.appendChild(newNode);
    return newNode;
}
function getByID(id){
    var element = document.getElementById(id);
    return element;
}

function rightclicker(){
    $(getByID("hello")).trigger({
        type:'mousedown',
        which: 3
    });
}


// ------------------------------------------------------

function printTable(table){
    let t = "";
    let counter = 0;
    for (var i = 0; i < table.length; i++){
        for (var j = 0; j < table[i].length; j++){
            
            if(table[i][j].value == null){
                t+= " " + table[i][j];
            } else{
                if (table[i][j].value == "B") counter+=1;
                t += " " + table[i][j].value;
            }
        }
        t+="\n";
    }
    return t //+"Counter: " + counter + "\n";
}
function validCoordinate(r, c){
    return r >= 0 && c >=0 && r < row && c < col;
}
function numToString(value){
    if(value==0) return "zero";
    else if(value==1) return"one";
    else if(value==2) return"two";
    else if(value==3) return"three";
    else if(value==4) return"four";
    else if(value==5) return"five";
    else if(value==6) return"six";  
    else if(value==7) return"seven";
    else if(value==8) return"eight";
    
}

function test(id){
    // For some reason this gives the element
    $(getByID("0_0")).trigger({
        type: 'mousedown',
        which: 3
    });
}

function revealBoard(){
    let flagTiles = document.getElementsByClassName("flag");
    for(td of flagTiles){
        
        let coords = td.id.split("_");
        let x = Number(coords[0]);
        let y = Number(coords[1]);
        if (game[x][y].value !="B") {
            td.classList.remove("flag");
            td.classList.add("bombx");
        }
    }

    for(var coords of bombCoords){
        let bRow = coords.x;
        let bCol = coords.y;
        let td = getByID(bRow + "_" + bCol);
        
        
        


        
        td.classList.add("shown");
        td.classList.remove("blank");
        td.classList.add("bomb");
        
        
    }

    getByID("container").classList.add("unclickable");
}

function bombInFirstArea(bRow, bCol, firstclick){
   
   
    if (bRow == firstclick.x && bCol == firstclick.y)  return true;
    for(var dir of omniDirection){
        if(bRow + dir.x == firstclick.x && bCol + dir.y == firstclick.y) return true;
    }
    return false;
}

function setup(r,c,b, firstclick){
    firstClick = false;
    col = c;
    row = r;
    bombs = b;
    let table = new Array(row);
    for (var i = 0; i < table.length; i++){
        table[i] = new Array(col);
        for(var j = 0; j < table[i].length; j++){
            let tile = new Object();
            tile.value = 0;
            tile.shown = false;
            table[i][j] = tile;
        }
    }

    for (var i = 0; i < bombs; i++){
        do {
            bRow = Math.floor(Math.random()*row);
            bCol = Math.floor(Math.random()*col);
            bombCoords.push({x:bRow, y:bCol})
        } while(table[bRow][bCol].value=="B" || bombInFirstArea(bRow, bCol, firstclick))

       
        

        table[bRow][bCol].value = "B";

        for(var dir of omniDirection){
            if(validCoordinate(bRow + dir.x, bCol + dir.y) && table[bRow+dir.x][bCol+dir.y].value !== "B"){
                table[bRow+dir.x][bCol+dir.y].value+=1;
            }
        }
    }

    // console.log(printTable(table));

    return table;


}

function landLocked(r, c){
    for(var dir of omniDirection){
        if ( validCoordinate(r+dir.x,c+dir.y) && aiGrid[r+dir.x][c+dir.y]=="-") {
            
            return false;
        }
    }
    return true;
}

function updateShownBorders(addedTiles, removeTile){

    for(var id of addedTiles){
        shownBorderTiles.add(id);
        hiddenBorderTiles.delete(id);
        var coords = id.split("_");
        var x = Number(coords[0]);
        var y = Number(coords[1]);


        for (var dir of omniDirection){
            let newRow = x+dir.x;
            let newCol = y+dir.y;
            if(!validCoordinate(newRow,newCol)) continue;


            if (landLocked(newRow, newCol) && aiGrid[newRow][newCol]!= 0){
                // console.log("LandLocked: " + newRow+"_"+newCol);
                shownBorderTiles.delete(newRow+"_"+newCol); 
            }
        }
    }

    if (removeTile!=null){
        shownBorderTiles.delete(removeTile);
    } 
    
}


function updateHiddenBorders(addedTiles, removeTile){
    for(var tile of addedTiles){
        let coords = tile.split("_");
        let row = Number(coords[0]);
        let col = Number(coords[1]);
        for (var dir of omniDirection){
            if (!validCoordinate(row+dir.x, col+dir.y)) continue;
            if (aiGrid[row+dir.x][col+dir.y] == "-"){
                hiddenBorderTiles.add((row+dir.x)+"_"+(col+dir.y));
            }
        }
    }
    if (removeTile!=null){
        hiddenBorderTiles.add(removeTile);
        let coords = removeTile.split("_");
        let row = Number(coords[0]);
        let col = Number(coords[1]);
        for (var dir of omniDirection){
            if (!validCoordinate(row+dir.x, col+dir.y)) continue;
            if (aiGrid[row+dir.x][col+dir.y] == "-"){
                hiddenBorderTiles.delete((row+dir.x)+"_"+(col+dir.y));
            }
        }
    }
}

function clickEvent(td, which){
    
    // TODO: Some tiles aren't being removed fromt he borders array
    var addedTiles = new Set();
    var removeTile = null;
   
    if (which == 1 && td.classList.contains("blank")){

        let tilesToInspect = [td];
        while(tilesToInspect.length>0){
   
            var tile = tilesToInspect.pop();
            var coords = tile.id.split("_");
            var r = Number(coords[0]);
            var c = Number(coords[1]);

            aiGrid[r][c] = game[r][c].value;
            
            tile.classList.add("shown");
            tile.classList.add(numToString(game[r][c].value)); 
            tile.classList.remove("blank");

            if (game[r][c].value != 0 && game[r][c].value != "B"){
                
                addedTiles.add(tile.id);
                continue;
            } else if (game[r][c].value == "B"){
                getByID(r+"_"+c).classList.add("redbomb");
                revealBoard();
                break;
            } else if (game[r][c].value == 0){
                for (var dir of omniDirection){
                    let newRow = r + dir.x;
                    let newCol = c + dir.y;
                    let newTD = getByID(newRow+"_"+newCol)
                    if (validCoordinate(newRow, newCol) && !newTD.classList.contains("shown"))
                        tilesToInspect.push(newTD);
                }
            }
            
        }


    } 
    else if (which ==3 && !td.classList.contains("shown")){

        var coords = td.id.split("_");
        var r = Number(coords[0]);
        var c = Number(coords[1]);
        if (td.classList.contains("blank")){
            td.classList.add("flag");
            td.classList.remove("blank");
            addedTiles.add(td.id);
            aiGrid[r][c] = "F";
        }

        else if (td.classList.contains("flag")){
            td.classList.add("blank");
            td.classList.remove("flag");
            removeTile = td.id;
            aiGrid[r][c] = "-";
        }

        

    }

    updateShownBorders(addedTiles, removeTile);
    updateHiddenBorders(addedTiles, removeTile);
    // console.log(shownBorderTiles.values());
    // console.log(hiddenBorderTiles.values());
    // console.log(printTable(aiGrid))
}

function newGame(numRows, numCols, numBombs){
    // game = setup(numRows, numCols, numBombs);
    // var game;
    
    var gameContainer = document.getElementById("container");
    aiGrid = new Array(numRows);
    shownBorderTiles = new Set();
    hiddenBorderTiles = new Set();
    for(var i = 0; i < numRows; i++){
        aiGrid[i] = new Array(numCols);
        aiGrid[i].fill("-");
    }
    console.log(aiGrid)
    
    var gameTable = createNode("table", gameContainer);
    

    
    for(var i = 0; i < numRows; i++){
        var tr = createNode("tr", gameTable);
        for(var j = 0; j < numCols; j++){
            var td = createNode("td", tr);


            td.id= i+"_"+j;
            
            let argument = td.id;
            let xCoord = i;
            let yCoord = j;

            td.classList.add("blank");

           
            td.onmousedown = function(e){
               
                if (firstClick){

                    game = setup(numRows, numCols, numBombs, {x: xCoord, y:yCoord});
                    
                }
                    
                clickEvent(getByID(argument), e.which);

                
            }
        }
    }
}

function flagsAround (row,col){

    var flagCount = 0;
    for(var dir of omniDirection){
        var newRow = row +dir.x;
        var newCol = col + dir.y;
        if (!validCoordinate(newRow, newCol)) continue;
        if (aiGrid[newRow][newCol] == "F") flagCount +=1;

    }

    return flagCount;

}

function freeSquaresAround(row, col){
    var freeSpaces = new Array();
    for(var dir of omniDirection){
        var newRow = row +dir.x;
        var newCol = col + dir.y;
        if (!validCoordinate(newRow, newCol)) continue;
        if (aiGrid[newRow][newCol] == "-") freeSpaces.push({row: newRow, col: newCol});

    }

    return freeSpaces;
}

function printShownBorders(){
    var array = new Array();
    for(var id of shownBorderTiles){
        array.push(getByID(id))
    }
    console.log(array);
}
function makeMove(){

    if (firstClick){
        $(getByID("8_15")).trigger({
            type:'mousedown',
            which: 1
        });
        return;
    }
    let tilesToInspect = shownBorderTiles.values();
    var success = false;
    for(var id of tilesToInspect){
        var coords = id.split("_");
        var row = Number(coords[0]);
        var col = Number(coords[1]);

        var tileNum = aiGrid[row][col];
        var flagNum = flagsAround(row, col);
        var freeSpacesArr = freeSquaresAround(row, col);

        

        // Guarenteed Bombs
        if (tileNum-flagNum == freeSpacesArr.length){
            console.log("Guarented Bomb");
            console.log(getByID(id));
            console.log(landLocked(row,col)); 
            for(var clickTile of freeSpacesArr){
                var id = clickTile.row+"_"+clickTile.col;
                $(getByID(id)).trigger({
                    type:'mousedown',
                    which: 3
                });
            }
            success = true;
        }


        // Guarenteed Spaces
        if (tileNum == flagNum && freeSpacesArr.length > 0){
            
            for(var clickTile of freeSpacesArr){
                var id = clickTile.row+"_"+clickTile.col;
                $(getByID(id)).trigger({
                    type:'mousedown',
                    which: 1
                });
            }
            success= true;
        }
    }

    if (success){
        console.log("success");
    } else{
        console.log("fail");
    }
}





window.onload=function(){
    
  
    window.oncontextmenu = function (){
        return false;
    } 

    
   
    let numRows = 16;
    let numCols = 30;
    let numBombs = 100;
    // this.getByID("newgame").addEventListener("click", this.newGame(numRows, numCols, numBombs));

    let start = new Date().getTime();
    newGame(numRows, numCols, numBombs);
    let end = new Date().getTime();

    console.log((end-start)/1000);
}
