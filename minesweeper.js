var row;
var col;
var numBombs;
var game;
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
function setup(r,c,b){

    col = c;
    row = r;
    numBombs = b;
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

    for (var i = 0; i < numBombs; i++){
        do {
            bRow = Math.floor(Math.random()*row);
            bCol = Math.floor(Math.random()*col);
        } while(table[bRow][bCol].value=="B" )

       
        

        table[bRow][bCol].value = "B";

        for(var dir of omniDirection){
            if(validCoordinate(bRow + dir.x, bCol + dir.y) && table[bRow+dir.x][bCol+dir.y].value !== "B"){
                table[bRow+dir.x][bCol+dir.y].value+=1;
            }
        }
    }
    return table;
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
    for(var row = 0; row < game.length; row++){
        for (var col=0; col < game[row].length; col++){
            let td = getByID(row +"_"+col);
            td.classList.add("shown");
            td.classList.remove("blank");
            if(game[row][col].value=="B") td.classList.add("bomb");
            else td.classList.add(numToString(game[row][col].value));
        }
    }
}

function clickEvent(td, which){
    if (which == 1 && td.classList.contains("blank")){

        td.classList.add("shown");
        td.classList.remove("blank");
        console.log(td.id);
        console.log(td.id.split("_"))

        var coords = td.id.split("_");
        var row = Number(coords[0]);
        var col = Number(coords[1]);

        console.log(game[row][col].value);
        if(game[row][col].value=="B") td.classList.add("bomb");
        else td.classList.add(numToString(game[row][col].value));
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

function newGame(){
    game = setup(16,30,100);

    var gameContainer = document.getElementById("container");
    console.log(gameContainer);
    var gameTable = createNode("table", gameContainer);

    for(var i = 0; i < game.length; i++){
        var tr = createNode("tr", gameTable);
        for(var j = 0; j < game[i].length; j++){
            var td = createNode("td", tr);
            // td.textContent = game[i][j].value;

            td.id= i+"_"+j;
            
            let argument = td.id;

            td.classList.add("blank");

            td.onmousedown = function(e){
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
   
    newGame();
}
