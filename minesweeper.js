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



// ------------------------------------------------------

function printTable(table){
    let t = "";
    let counter = 0;
    for (var i = 0; i < table.length; i++){
        for (var j = 0; j < table[i].length; j++){
            if (table[i][j].value == "B") counter+=1;
            t += " " + table[i][j].value;
        }
        t+="\n";
    }
    return t +"Counter: " + counter + "\n";
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
    return NaN;
}

function test(id){
    // For some reason this gives the element
    id.classList.add("shown");
    id.classList.remove("blank");
}

function revealBoard(){

    for(var coords of bombCoords){
        let bRow = coords.x;
        let bCol = coords.y;
        let td = getByID(bRow + "_" + bCol);
        
        td.classList.add("shown");
        td.classList.remove("blank");
        td.classList.add("bomb");
    }
    // for(var row = 0; row < game.length; row++){
    //     for (var col=0; col < game[row].length; col++){
    //         let td = getByID(row +"_"+col);
    //         td.classList.add("shown");
    //         td.classList.remove("blank");
    //         if(game[row][col].value=="B") td.classList.add("bomb");
    //         else td.classList.add(numToString(game[row][col].value));
    //     }
    // }
}

function notInFirstClick(bRow, bCol, firstclick){
   
    console.log(firstclick)
    if (bRow == firstclick.x && bCol == firstclick.y)  return false;
    for(var dir of omniDirection){
        if(bRow + dir.x == firstclick.x && bCol + dir.y == firstclick.y) return false;
    }
    return true;
}

function setup(r,c,b, firstclick){

    console.log("setup entered");
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
        } while(table[bRow][bCol].value=="B"/* && notInFirstClick(bRow, bCol, firstclick)*/)

       
        

        table[bRow][bCol].value = "B";

        for(var dir of omniDirection){
            if(validCoordinate(bRow + dir.x, bCol + dir.y) && table[bRow+dir.x][bCol+dir.y].value !== "B"){
                table[bRow+dir.x][bCol+dir.y].value+=1;
            }
        }
    }

    console.log(printTable(table));

    return table;


}


function clickEvent(td, which){
    console.log("Entered click function");
    if (which == 1 && td.classList.contains("blank")){

        let tilesToInspect = [td];
        while(tilesToInspect.length>0){
            console.log(tilesToInspect.length)
            var tile = tilesToInspect.pop();
            var coords = tile.id.split("_");
            var r = Number(coords[0]);
            var c = Number(coords[1]);

            tile.classList.add("shown");
            tile.classList.add(numToString(game[r][c].value)); 
            tile.classList.remove("blank");

            if (game[r][c].value != 0 && game[r][c].value != "B"){
                
                continue;
            } else if (game[r][c].value == "B"){
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
        // 

    } 
    else if (which ==3 && !td.classList.contains("shown")){

        if (td.classList.contains("blank")){
            td.classList.add("flag");
            td.classList.remove("blank");
        }

        else if (td.classList.contains("flag")){
            td.classList.add("blank");
            td.classList.remove("flag");
        }

    }
}

function newGame(numRows, numCols, numBombs){
    game = setup(numRows, numCols, numBombs);

    var gameContainer = document.getElementById("container");
    console.log(gameContainer);
    var gameTable = createNode("table", gameContainer);
    

    for(var i = 0; i < numRows; i++){
        var tr = createNode("tr", gameTable);
        for(var j = 0; j < numCols; j++){
            var td = createNode("td", tr);
            // td.textContent = game[i][j].value;

            td.id= i+"_"+j;
            
            let argument = td.id;

            td.classList.add("blank");

            td.onmousedown = function(e){
            
                // setup(numRows, numCols, numBombs, {x: i, y: j})
                clickEvent(getByID(argument), e.which);

            }

        }
    }

}





window.onload=function(){
    // console.log(document.getElementById("container"))
  
    window.oncontextmenu = function (){
        return false;
    } 
   
    let numRows = 16;
    let numCols = 30;
    let numBombs = 100;
    newGame(numRows, numCols, numBombs);
}
