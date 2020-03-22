var aiGrid = [
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "F", 2, 0, 0, 0, 0, 0, 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "F", 3, 0, 0, 0, 0, 1, 2, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-" ,"-" ,"-"],
    [ "-", "-", "-", "-", "-", "-" ,"-" ,"-" ,"-" ,"-", "F", 2, 0, 0 ,0 ,0 ,2, "F", "-", "-" ,"-" ,"-", "-", "-" ,"-", "-", "-", "-", "-", "-"],
    [ "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", 3, 1, 0, 1, 1, 1, 2, "F", "F", 2, 1, 2, "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", 4, 2, 3, "F", "-", "-", "-", 3, 1, 0, 1, "F", 1, 1, 2, 2, 1, 1, 2, "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", 2, 1, 2, "F", 3, 3, "F", "F", 2, 1, 2, 1, 1, 0, 0, 0, 0, 1, "F", 4, "-", "-", "-", "-", "-", "-", "-"],
    ["-", 2, 2, "F", 1, 1, 1, 1, 1, 2, 3, 3, "F", 1, 0, 0, 0, 0, 0, 0, 1, 2, "F", 2, 1, 2, 2, "-", "-", "-"],
    ["-", 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, "F", 2, 1, 0, 0, 1, 1, 1, 0, 0, 1, 2, 2, 1, 1, "F", 3, "-", "-"],
    ["-", 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 1, "F", 1, 0, 0, 0, 1, "F", 1, 1, 2, 4, "-", "-"],
    ["-", 2, 1, 1, 1, 0, 0, 0, 1, "F", 2, 1, 0, 0, 1, 1, 3, 2, 2, 0 ,0 ,0 ,1 ,1, 1, 0, 1, "F", "-", "-"],
    ["-", 3, 3, "F", 1, 0, 0, 0, 2, 3, "F", 2, 2, 1, 3 ,"F" ,3 ,"F" ,1 ,0, 0, 0, 0, 0, 1, 1, 2, 2, "-", "-"],
    [ "-", "F", "F", 4, 2, 0, 0, 1, 2, "F", 3, "F", 3, "F" ,5 ,"F" ,4, ,2, 2, 0, 0, 0, 0, 0 ,1, "F", 1, 1, "-", "-"],
    ["-", "F", "F", "F", 1, 0, 0, 2, "F", 3, 3, 2, 4, "F", "F", 3, 3 ,"F", 2, 0, 0, 0, 1, 1, 2, 1 ,1, 2, ""-"", ""-""],
    [3, "F", 4, 2, 1, 0, 0, 2, "F", 2, 1 ,"F" ,2, 3, "F", 2, 3, "F", 4, 2, 3, 3, 3, "F", 1, 0, 0, 2, "-", "-"],
    [ "-", 2, 1, 1, 1, 2, 1, 2, 1, 1, 1 ,1 ,1 ,1 ,2, 2, 3, "F" ,5, "F", "F" ,"F", "F", 2 ,2 ,1, 2 ,2, "-", "-"],
    ["-", 1, 0, 1, "F", 2, "F", 1, 0, 0, 0, 0, 0, 0, 1, "F", 2, 2, "F", "F", "F", 4, 2, 1, 1, "F", 2, "F", "-", "-"],
]

var hiddenBorderTiles = new Set(["15_0", "14_0", "12_28", "13_28", "11_28", "14_28", "15_28", "2_19", "2_18", "2_20", "2_21", "4_22", "3_22", "2_22", "1_18", "0_18", "5_23", "4_23", "5_24", "10_28", "3_9", "2_9", "4_9", "9_0", "8_0", "10_0", "7_0", "6_0", "5_25", "5_26", "6_27", "5_27", "9_28", "5_2", "4_2", "4_7", "4_8", "5_1", "5_0", "8_28", "7_28", "6_28", "11_0", "3_4", "3_3", "3_5", "3_2", "3_6", "14_0", "12_0"]);
var omniDirection = [
    {x:0, y:-1}, 
    {x:0, y:1}, 
    {x:-1, y:0}, 
    {x:1, y:0}, 
    {x:-1, y:-1}, 
    {x:1, y:1}, 
    {x:-1, y:1}, 
    {x:1, y:-1} 
];

var row = 16;
var col = 30;
var bombs= 99;
function landLocked(r, c){
    
    for(var dir of omniDirection){
        if (validCoordinate(r+dir.x,c+dir.y) && (aiGrid[r+dir.x][c+dir.y]=="-" || aiGrid[r+dir.x][c+dir.y]=="B")) {
    
            return false;
        }
    }
    return true;
}
function isNumber(i,j){
    return aiGrid[i][j]>0 && aiGrid[i][j]<=8;
}
function validCoordinate(r, c){
    return r >= 0 && c >=0 && r < row && c < col;
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
       
        
        // else if (isNumber(newRow, newCol) && hiddenBorders.includes((newRow+dir.x)+"_"+(newCol+dir.y))  && !section.includes((newRow+dir.x)+"_"+(newCol+dir.y))){
        //     addConnected(section, hiddenBorders, newRow+dir.x,  newCol + dir.y);
        // }

    }

    if (!foundClose){
        for (var sdir of secondBorderCells){
            var nextDegreeRow = row+sdir.x;
            var nextDegreeCol = col+sdir.y;
            var nextDegreeTD = nextDegreeRow+"_"+nextDegreeCol;
            if (!validCoordinate(nextDegreeRow, nextDegreeCol)) continue;
            // if (!isNumber(nextDegreeRow,nextDegreeCol)) continue;
            if (hiddenBorders.includes(nextDegreeTD) && !section.includes(nextDegreeTD)){
                addConnected(section, hiddenBorders, nextDegreeRow, nextDegreeCol);
                break;
            }
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


console.log(sectionDivide(Array.from(hiddenBorderTiles)))

