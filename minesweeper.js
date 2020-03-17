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
Array.prototype.clone = function() {
	return this.slice(0);
};
function leftClickTile(id){
    $(getByID(id)).trigger({
        type:'mousedown',
        which: 1
    });
}
function rightClickTile(id){
    $(getByID(id)).trigger({
        type:'mousedown',
        which: 3
    });
}
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
   
    console.log(bombCoords);
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

function bombInFirstArea(bRow, bCol, firstCoords){
   
   
    if (bRow == firstCoords.x && bCol == firstCoords.y)  return true;
    for(var dir of omniDirection){
        if(bRow + dir.x == firstCoords.x && bCol + dir.y == firstCoords.y) return true;
    }
    return false;
}

function setup(r,c,b, firstCoords){
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
            
        } while(table[bRow][bCol].value=="B" || bombInFirstArea(bRow, bCol, firstCoords))
        bombCoords.push({x:bRow, y:bCol})
       
        

        table[bRow][bCol].value = "B";

        for(var dir of omniDirection){
            if(validCoordinate(bRow + dir.x, bCol + dir.y) && table[bRow+dir.x][bCol+dir.y].value !== "B"){
                table[bRow+dir.x][bCol+dir.y].value+=1;
            }
        }
    }



    return table;


}

function landLocked(r, c){
    
    for(var dir of omniDirection){
        if (validCoordinate(r+dir.x,c+dir.y) && aiGrid[r+dir.x][c+dir.y]=="-") {
            // console.log("landlocked function")
            // console.log(aiGrid[r+dir.x][c+dir.y]);
            return false;
        }
    }
    return true;
}

function updateShownBorders(addedTiles, removeTile){

    for(var id of addedTiles){


        
        hiddenBorderTiles.delete(id);
        var coords = id.split("_");
        var x = Number(coords[0]);
        var y = Number(coords[1]);
        
        if(!landLocked(x,y) && aiGrid[x][y]!=0) shownBorderTiles.add(id);


      

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
    
    // TODO: Some tiles aren't being removed from the borders array
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
                addedTiles.add(tile.id);
                for (var dir of omniDirection){
                    let newRow = r + dir.x;
                    let newCol = c + dir.y;
                    let newTD = getByID(newRow+"_"+newCol);
                    if (validCoordinate(newRow, newCol))
                    if (!newTD.classList.contains("shown"))
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

    
    var gameContainer = document.getElementById("container");
    aiGrid = new Array(numRows);
    shownBorderTiles = new Set();
    hiddenBorderTiles = new Set();
    for(var i = 0; i < numRows; i++){
        aiGrid[i] = new Array(numCols);
        aiGrid[i].fill("-");
    }
    
    
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
 
    // var array = new Array();
    // for(var id of shownBorderTiles){
    //     let x = Number(id.split("_")[0]);
    //     let y = Number(id.split("_")[1]);
        
    //     array.push(getByID(id))
    // }
    // console.log(array);

    // for (id of shownBorderTiles){
    //     let x = Number(id.split("_")[0]);
    //     let y = Number(id.split("_")[1]);
    //     if (landLocked(x,y)) console.log(getByID(id));
    // }

    var answer = new Array();
    for (var id of hiddenBorderTiles){
        answer.push(getByID(id));
    }
    return answer;
}
function makeMove(){

    if (firstClick){
        leftClickTile("8_15");
        return;
    }

    printShownBorders();
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
        if (tileNum-flagNum == freeSpacesArr.length && tileNum-flagNum != 0){
            // console.log("Guarented Bomb");
            // console.log(getByID(id));
            // console.log(landLocked(row,col)); 
            if (landLocked(row,col)) getByID("print").classList.add("unclickable");
            for(var clickTile of freeSpacesArr){
                var id = clickTile.row+"_"+clickTile.col;
                rightClickTile(id);

            }
            success = true;
            // return;
        }


        // Guarenteed Spaces
        if (tileNum == flagNum && freeSpacesArr.length > 0){
            
            for(var clickTile of freeSpacesArr){
                var id = clickTile.row+"_"+clickTile.col;
                leftClickTile(id);
 
            }
            success= true;
            // return;
        }
    }



    if (success){
        console.log("success");
    } else{
        console.log("fail");
        // console.log(printShownBorders());
        // randomMove();
        var probability = findProabilities();
    
        var foundSmallestProbability = false;
        var minBombs = Math.min(...Object.values(probability));

        for (var id in probability){
            if (probability[id] == minBombs){
                

                leftClickTile(id);
                if (minBombs != 0) break;
            }
        }

      

        
    }
}





function getNumTiles(r,c){
    let numTileArray = new Array()
    for(var dir of omniDirection){
        var newRow = r + dir.x;
        var newCol = c + dir.y;
        if (!validCoordinate(newRow, newCol)) continue;
        if(aiGrid[newRow][newCol] >0 && aiGrid[newRow][newCol] <=8){
            numTileArray.push(newRow+"_"+newCol);
        }
    }

    return numTileArray;

}


function getTotalFlags(r,c, virtualBombs){
    let totalFlags = 0;
    for(var dir of omniDirection){
        var newRow = r + dir.x;
        var newCol = c + dir.y;
        if (!validCoordinate(newRow, newCol)) continue;
        if(aiGrid[newRow][newCol] == "F" || virtualBombs.includes(newRow+"_"+newCol)){
            totalFlags+=1;
        }
    }

    return totalFlags;
}

function getTotalFreeSpaces(r,c,virtualBombs){
    let totalSpaces = 0;
    for(var dir of omniDirection){
        var newRow = r + dir.x;
        var newCol = c + dir.y;
        if (!validCoordinate(newRow, newCol)) continue;
        if(aiGrid[newRow][newCol] == "-" && !virtualBombs.includes(newRow+"_"+newCol)){
            totalSpaces+=1;
        }
    }

    return totalSpaces;
}

function isSolution(possibleBombs, hiddenBorders){

    
    for (var hiddenID of hiddenBorders){
        let hCoords = hiddenID.split("_");
        let hRow = Number(hCoords[0]);
        let hCol = Number(hCoords[1]);


        let neighborNumTiles = getNumTiles(hRow, hCol);
        for (var numTile of neighborNumTiles){
            let numCoords = numTile.split("_");
            let numRow = Number(numCoords[0]);
            let numCol = Number(numCoords[1]);
            let num = aiGrid[numRow][numCol];

            
            let totalFlags = getTotalFlags(numRow, numCol, possibleBombs);
            // let totalFreeSpaces = getTotalFreeSpaces(numRow, numCol, possibleBombs);
    
            if (totalFlags!=num) return false;
        }
    }
    return true;
    
}

function isViolation(possibleBombs){
    for (var bombID of possibleBombs){
        let bCoords = bombID.split("_");
        let bRow = Number(bCoords[0]);
        let bCol = Number(bCoords[1]);


        let neighborNumTiles = getNumTiles(bRow, bCol);
        for (var numTile of neighborNumTiles){
            let numCoords = numTile.split("_");
            let numRow = Number(numCoords[0]);
            let numCol = Number(numCoords[1]);
            let num = aiGrid[numRow][numCol];

            let totalFlags = getTotalFlags(numRow, numCol, possibleBombs);
    
            if (totalFlags>num) return true;
        }
    }
    return false;
}

function tankSolver(){
    let hiddenBorders = Array.from(hiddenBorderTiles);
    var solutions = new Array();
    
    var states = new Array(); 
    states.push({
        possibleBombs: new Array(),
        nextBombIndex: 0
    });

    // console.log(states.length)
    while(states.length!=0){
        let s = states.pop();
        if (isSolution(s.possibleBombs, hiddenBorders)){
            solutions.push(s.possibleBombs);
        } else{
            if (isViolation(s.possibleBombs)){
                continue;
            }
            if (s.nextBombIndex >= hiddenBorders.length) continue;


            
            states.push({
                possibleBombs: s.possibleBombs.clone(),
                nextBombIndex: s.nextBombIndex+1
            })

            var nextArray = s.possibleBombs.clone();
            nextArray.push(hiddenBorders[s.nextBombIndex]);
        
            states.push({
                possibleBombs: nextArray,
                nextBombIndex: s.nextBombIndex+1
            });

            
        }
    }


    return solutions;
    
}
/*
Copy and Paste if it does not work
function addConnected(section, hiddenBorders, row, col){
    section.push(row+"_"+col);

    for (var dir of omniDirection){
        var newRow = row + dir.x;
        var newCol = col + dir.y;
        var newTD = newRow+"_"+newCol;

        if (hiddenBorders.includes(newTD) && !section.includes(newTD)){
            addConnected(section, hiddenBorders, newRow, newCol)
        }

    }
    
}
*/
function addConnected(section, hiddenBorders, row, col){
    section.push(row+"_"+col);

    for (var dir of omniDirection){
        var newRow = row + dir.x;
        var newCol = col + dir.y;
        var newTD = newRow+"_"+newCol;

        if (hiddenBorders.includes(newTD) && !section.includes(newTD)){
            addConnected(section, hiddenBorders, newRow, newCol)
        }

    }
    
}

function sectionDivide(hiddenBorders){
    var sections = new Array();

    
    for(var hiddenTile of hiddenBorders){

        var alreadyInSection = false;
        for (var i = 0; i < sections.length; i++){
 
            if (sections[i].includes(hiddenTile)){
                alreadyInSection = true;
                break;
            }
        }

        if(!alreadyInSection){
            let r = Number(hiddenTile.split("_")[0]);
            let c = Number(hiddenTile.split("_")[1]);
            if (getNumTiles(r,c).length == 0) continue;
            let partition =  new Array();
            addConnected(partition, hiddenBorders, r, c, -1,-1)
            sections.push(partition);
        }
    }
    return sections;
    
}
function findProabilities(){
    let sections = sectionDivide(Array.from(hiddenBorderTiles));
    console.log(sections);
    probability = {}
    for (tileid of hiddenBorderTiles){
        probability[tileid] = 0;
    }

    for (var sec of sections){
        // if (sec.length > 24) {
        //     randomMove(sec);
        //     break;
        // }
        console.log(sec);
        let start = new Date().getTime();
        var partialSolution = tankSolver(sec);
        let end = new Date().getTime();
        console.log((end-start)/1000);
        
        for (var solutionBombs of partialSolution){
            for (var bombTile of solutionBombs){
                probability[bombTile] += 1;
            }
        }
    }
    
    return probability
}


function randomMove(){
    
    var randomTileID; 
    for(var tile of hiddenBorderTiles.values()){
        randomTileID = tile;
        break;
    }
        
    leftClickTile(randomTileID);
}




window.onload=function(){
    
  
    window.oncontextmenu = function (){
        return false;
    } 

    // document.onkeydown = function(e){
    //     e = e || window.event;
        
    //     printShownBorders();
    // }
   
    let numRows = 16;
    let numCols = 30;
    let numBombs = 99;
    // this.getByID("newgame").addEventListener("click", this.newGame(numRows, numCols, numBombs));

    let start = new Date().getTime();
    newGame(numRows, numCols, numBombs);
    let end = new Date().getTime();

    // console.log((end-start)/1000);
}
