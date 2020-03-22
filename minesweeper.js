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
var winState = false;
var loseState = false;
var BOMBLIMIT = 20;


// 
Array.prototype.clone = function() {
	return this.slice(0);
};
function clear (element)
{
    while (element.lastChild)
        element.removeChild (element.lastChild);
}
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
   
    console.log(landLocked(Number(getByID("row").value), Number(getByID("col").value)) );
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

    getByID("game-container").classList.add("unclickable");
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
        if (validCoordinate(r+dir.x,c+dir.y) && (aiGrid[r+dir.x][c+dir.y]=="-" || aiGrid[r+dir.x][c+dir.y]=="B")) {
    
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

        hiddenBorderTiles.delete(removeTile);
        // hiddenBorderTiles.add(removeTile);
        // let coords = removeTile.split("_");
        // let row = Number(coords[0]);
        // let col = Number(coords[1]);
        // for (var dir of omniDirection){
        //     if (!validCoordinate(row+dir.x, col+dir.y)) continue;
        //     if (aiGrid[row+dir.x][col+dir.y] == "-"){
        //         hiddenBorderTiles.delete((row+dir.x)+"_"+(col+dir.y));
        //     }
        // }
    }
}

function clickEvent(td, which){
    
    
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
                loseState = true;

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
            // addedTiles.add(td.id);
            removeTile = td.id;
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
}

function newGame(numRows, numCols, numBombs){

    
    var gameContainer = document.getElementById("game-container");
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
                    // game = [
                    //     ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "F", 2, 0, 0, 0, 0, 0, 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
                    //     ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "F", 3, 0, 0, 0, 0, 1, 2, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-" ,"-" ,"-"],
                    //     [ "-", "-", "-", "-", "-", "-" ,"-" ,"-" ,"-" ,"-", "F", 2, 0, 0 ,0 ,0 ,2, "F", "-", "-" ,"-" ,"-", "-", "-" ,"-", "-", "-", "-", "-", "-"],
                    //     [ "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", 3, 1, 0, 1, 1, 1, 2, "F", "F", 2, 1, 2, "-", "-", "-", "-", "-", "-", "-", "-"],
                    //     ["-", "-", "-", 4, 2, 3, "F", "-", "-", "-", 3, 1, 0, 1, "F", 1, 1, 2, 2, 1, 1, 2, "-", "-", "-", "-", "-", "-", "-", "-"],
                    //     ["-", "-", "-", 2, 1, 2, "F", 3, 3, "F", "F", 2, 1, 2, 1, 1, 0, 0, 0, 0, 1, "F", 4, "-", "-", "-", "-", "-", "-", "-"],
                    //     ["-", 2, 2, "F", 1, 1, 1, 1, 1, 2, 3, 3, "F", 1, 0, 0, 0, 0, 0, 0, 1, 2, "F", 2, 1, 2, 2, "-", "-", "-"],
                    //     ["-", 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, "F", 2, 1, 0, 0, 1, 1, 1, 0, 0, 1, 2, 2, 1, 1, "F", 3, "-", "-"],
                    //     ["-", 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 1, "F", 1, 0, 0, 0, 1, "F", 1, 1, 2, 4, "-", "-"],
                    //     ["-", 2, 1, 1, 1, 0, 0, 0, 1, "F", 2, 1, 0, 0, 1, 1, 3, 2, 2, 0 ,0 ,0 ,1 ,1, 1, 0, 1, "F", "-", "-"],
                    //     ["-", 3, 3, "F", 1, 0, 0, 0, 2, 3, "F", 2, 2, 1, 3 ,"F" ,3 ,"F" ,1 ,0, 0, 0, 0, 0, 1, 1, 2, 2, "-", "-"],
                    //     [ "-", "F", "F", 4, 2, 0, 0, 1, 2, "F", 3, "F", 3, "F" ,5 ,"F" ,4, ,2, 2, 0, 0, 0, 0, 0 ,1, "F", 1, 1, "-", "-"],
                    //     ["-", "F", "F", "F", 1, 0, 0, 2, "F", 3, 3, 2, 4, "F", "F", 3, 3 ,"F", 2, 0, 0, 0, 1, 1, 2, 1 ,1, 2, ""-"", ""-""],
                    //     [3, "F", 4, 2, 1, 0, 0, 2, "F", 2, 1 ,"F" ,2, 3, "F", 2, 3, "F", 4, 2, 3, 3, 3, "F", 1, 0, 0, 2, "-", "-"],
                    //     [ "-", 2, 1, 1, 1, 2, 1, 2, 1, 1, 1 ,1 ,1 ,1 ,2, 2, 3, "F" ,5, "F", "F" ,"F", "F", 2 ,2 ,1, 2 ,2, "-", "-"],
                    //     ["-", 1, 0, 1, "F", 2, "F", 1, 0, 0, 0, 0, 0, 0, 1, "F", 2, 2, "F", "F", "F", 4, 2, 1, 1, "F", 2, "F", "-", "-"],
                    // ]
                    
                    // hiddenBorderTiles = new Set(["12_28", "13_28", "11_28", "14_28", "15_28", "2_19", "2_18", "2_20", "2_21", "4_22", "3_22", "2_22", "1_18", "0_18", "5_23", "4_23", "5_24", "10_28", "3_9", "2_9", "4_9", "9_0", "8_0", "10_0", "7_0", "6_0", "5_25", "5_26", "6_27", "5_27", "9_28", "5_2", "4_2", "4_7", "4_8", "5_1", "5_0", "8_28", "7_28", "6_28", "11_0", "3_4", "3_3", "3_5", "3_2", "3_6", "14_0", "15_0", "12_0"]);
                    
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
 

    var answer = new Array();
    for (var id of hiddenBorderTiles){
        answer.push(getByID(id));
    }
    return answer;
}
function makeMove(){
    console.clear();
    
    if (winState || loseState){
        alert("Game is Over. Press New Game");
        return;
    }

    


    if (firstClick){
        leftClickTile("8_15");
        return;
    }



    var tilesToInspect = new Array();
    for (var i = 0; i < aiGrid.length; i++){
        for (var j = 0; j < aiGrid[i].length; j++){
            if (isNumber(i,j) && !landLocked(i,j))
                tilesToInspect.push(i+"_"+j);
        }
    }


    var success = false;
    for(var id of tilesToInspect){
        var coords = id.split("_");
        var row = Number(coords[0]);
        var col = Number(coords[1]);

        var tileNum = aiGrid[row][col];
        var flagNum = flagsAround(row, col);
        var freeSpacesArr = freeSquaresAround(row, col);
        // 
        // Guarenteed Bombs
        if (tileNum-flagNum == freeSpacesArr.length && tileNum-flagNum != 0){

            
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
        console.log("Success - fundamental rules can be applied");
    } else{
        console.log("Failure - fundamental rules not applied");

        var probability = findProabilities();
        

        if (probability == null){
            console.log("Computation Time Too Long: Making random move");
           
            randomMove();
           
            return;
        }
        var minBombs = Math.min(...Object.values(probability)); 
        if (minBombs == Infinity){
            for(var element of document.getElementsByClassName("blank")){
               
                leftClickTile(element.id);
            }
        } else{
            // console.log(probability["total"]);
            console.log("Probability: " + minBombs +"/" +probability["total"]);
            for (var id in probability){
                if (id == "total") continue;
                if (probability[id] == minBombs){
                    
                   
                    leftClickTile(id);
                    if (minBombs != 0) break;
                }
            }
        }

    }
    // console.log(printTable(aiGrid));
    if (document.getElementsByClassName("blank").length == 0) {
        alert("You Win");
        winState = true;
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

function tankSolver(section){
    let hiddenBorders = section;
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
                // console.log(s.possibleBombs);s
                continue;
            }
            if (s.nextBombIndex >= hiddenBorders.length) continue;


            var clone = s.possibleBombs.clone();
            
            states.push({
                possibleBombs: clone,
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


function isNumber(i,j){
    return aiGrid[i][j]>0 && aiGrid[i][j]<=8;
}
function isFlag(){
    return  aiGrid[i][j] == "F";
}
function isEdge(i,j){

    return i==0 || i == row || j==0 || j==col;  
}


secondBorderCells = [
    {x: 0, y:2},
    {x: 1, y: 2},
    {x: 2, y: 2},
    {x: 2, y: 1},
    {x: 2, y:0},
    {x:2, y:-1},
    {x: 2, y:-2},
    {x: 1, y:-2},
    {x: 0, y:-2},
    {x: -1, y:-2},
    {x: -2, y:-2},
    {x: -2, y:-1},
    {x: -2, y:0},
    {x: -2, y:1},
    {x:-2, y:2},
    {x: -1, y:2}
]
function addConnected(section, hiddenBorders, row, col){
    section.push(row+"_"+col);
    var foundClose = false;

    for (var dir of omniDirection){
        var newRow = row + dir.x;
        var newCol = col + dir.y;
        var newTD = newRow+"_"+newCol;

        if (!validCoordinate(newRow, newCol)) continue;
        if (hiddenBorders.includes(newTD) && !section.includes(newTD)){
            foundClose = true;
            addConnected(section, hiddenBorders, newRow, newCol);
        }
       
    }


    for (var sdir of secondBorderCells){
        var nextDegreeRow = row+sdir.x;
        var nextDegreeCol = col+sdir.y;
        var nextDegreeTD = nextDegreeRow+"_"+nextDegreeCol;
        if (!validCoordinate(nextDegreeRow, nextDegreeCol)) continue;
        // if (!isNumber(nextDegreeRow,nextDegreeCol)) continue;
        if (hiddenBorders.includes(nextDegreeTD) && !section.includes(nextDegreeTD)){
            addConnected(section, hiddenBorders, nextDegreeRow, nextDegreeCol);
            
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
    var sections;
    if (document.getElementsByClassName("blank") <= BOMBLIMIT){
        sections = new Array();
        for (var tile of document.getElementsByClassName("blank")){
            sections.push(tile.id);
        }
    } else{
        sections = sectionDivide(Array.from(hiddenBorderTiles));
        sections.sort(function(a,b){
            return a.length - b.length;
        });
    }


    var computationString = "Computations: "
    for (var i = 0; i <  sections.length; i++){
        if (i == sections.length-1)
            computationString += "2^" + sections[i].length;
        else 
            computationString+= "2^" + sections[i].length + " + ";
    }

    
    console.log(computationString);
    probability = {}
    probability["total"] = 0;
    let start = new Date().getTime();
    for (var sec of sections){
        if (sec.length > 22) return null;
        for (tileid of sec){
            probability[tileid] = 0;
        }

        
        var partialSolution = tankSolver(sec.clone());
        probability["total"] += partialSolution.length;

        


        for (var solutionBombs of partialSolution){
            for (var bombTile of solutionBombs){
                probability[bombTile] += 1;
            }
        }
        
        for (var id in probability){
            if (probability[id] == 0){
   
                return probability;
            } 
        }
    
    
    }
    let end = new Date().getTime();
    console.log("Time Elapsed: " + (end-start)/1000 + " seconds");
    return probability;
}



function randomMove(){
    
    var randomTileID; 
    for(var tile of hiddenBorderTiles.values()){
        randomTileID = tile;
        break;
    }
        
    leftClickTile(randomTileID);
}



function start(){
    
    clear(getByID("game-container"));
    getByID("game-container").classList.remove("unclickable");
    row = null;
    col = null;
    bombs = null;
    game= null;
    bombCoords = [];
    winState = false;
    loseState =false;
    firstClick = true;
    aiGrid = null;
    shownBorderTiles= null;
    hiddenBorderTiles= null;
    let numRows = 16;
    let numCols = 30;
    let numBombs = 99;

    newGame(numRows, numCols, numBombs);
}

window.onload=function(){
    
  
    window.oncontextmenu = function (){
        return false;
    } 


    this.start();

    
}
