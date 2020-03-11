var row;
var col;
var numBombs;
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

function test(id){
    // For some reason this gives the element
    id.classList.add("shown");
    id.classList.remove("blank");
}

function newGame(){
    let game = setup(16,30,100);

    var gameContainer = document.getElementById("container");
    console.log(gameContainer);
    var gameTable = createNode("table", gameContainer);

    for(var i = 0; i < game.length; i++){
        var tr = createNode("tr", gameTable);
        for(var j = 0; j < game[i].length; j++){
            var td = createNode("td", tr);
            td.textContent = game[i][j].value;
            td.id= "rc" + i+""+j;
            console.log(td.id)
            let argument = td.id;
            console.log(argument);
            td.classList.add("blank");
            td.setAttribute("onclick", "test("+ argument + ")");
        }
    }

}


window.onload=function(){
    // console.log(document.getElementById("container"))
    
    newGame();
}
