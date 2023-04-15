//Global variables
let isRunning = false
let currentPlayer = 1
let hasTimeAvailable = false
let availableTime = 0
let intervalID = 0
let currentTurnText = document.querySelector('.current-turn-text')
let player1ScoreDisplay = document.querySelector(".player1-score")
let player2ScoreDisplay = document.querySelector(".player2-score")
let player1Score = 0
let player2Score = 0


const board1 = [
    [0, 0, 0, 0, 0, 0, 0],  //0
    [0, 0, 0, 0, 0, 0, 0],  //1
    [0, 0, 0, 0, 0, 0, 0],  //2
    [0, 0, 0, 0, 0, 0, 0],  //3
    [0, 0, 0, 0, 0, 0, 0],  //4
    [0, 0, 0, 0, 0, 0, 0],  //5
]


function resetScores(){
    player1Score = 0
    player2Score = 0
    player1ScoreDisplay.textContent = 0
    player2ScoreDisplay.textContent = 0
}

function updateScore(amount){
    if(currentPlayer === 1){
        player1Score += amount
        player1ScoreDisplay.textContent = player1Score
    } else {
        player2Score += amount
        player2ScoreDisplay.textContent = player1Score

    }
}

function startClock(){
    if(intervalID !== null){
        clearInterval(intervalID)
    }

    availableTime = 30

    let timerText = document.querySelector('.timer-text')
    timerText.textContent = `${availableTime} sec left`

    intervalID = setInterval(() => {
        if(availableTime > 0){
            availableTime -= 1
            timerText.textContent = `${availableTime} sec left`
        } else if(availableTime <= 0) {
            clearInterval(intervalID)
            setNextPlayer()
            currentTurnText.textContent = `Player ${currentPlayer}'s Turn`
            startClock()
        }
       
    },1000)

}

//TODO: need to check for 4 in a row going down, left/right, and diagonally
function check4InRow(row,col){
    let currentCoin = board1[row][col]
    total = 0
    //Check for diagonal 4 in a row
    if(row <= 2){
        //Check for down left 4 in a row

        //Check for down right 4 in a row
    }

    //Check for horizontal 4 in a row

    counter = 1
    //Check for vertical 4 in a row
    if(row <= 2){
        for(let i = row+1; i < board1.length && i <= row + 3; i++){
            let nextCoin = board1[i][col]
            if(currentCoin === nextCoin){
                counter += 1
            } else {
                counter = 1
            }
        }
        
        if(counter === 4){
            total += 1
        } 
    } 

    return total;
}

/**
 * Changes the color for coin slot at row and color
 * using the provided color value
 */
function changeColor(row,col,color,startRow = 0){
    //Get reference to board
    let board = document.querySelector(`.board-grid`)
    
    //Get the collection of all coin slots
    let coinSlots = board.children
    
    //Get index for targeted coinslot
    let idx = row*board1[0].length + col
    let coinSlot = coinSlots[idx]
   
    //Change color of coin slot
    coinSlot.style.backgroundColor = color;
}




function animateCoinSlots(row,col,startRow = 0,completionHandler){
   
    //Restored color for the previous coin slot i.e. coin slot above current coin slot
    if(startRow > 0){
        changeColor(startRow-1,col,"white")
    }

    //change color of current coin slot
    let color = currentPlayer === 1 ? "red" : "blue"
    changeColor(startRow,col,color)

    setTimeout(() => {

        //animate next coin slot until you reach selected coin slot
        if(startRow < row){
            animateCoinSlots(row,col,startRow+1,completionHandler)
        } else {
            completionHandler()
            clearInterval(intervalID)
            let timerText = document.querySelector('.timer-text')
            timerText.textContent = "30 sec left"
            startClock()

            currentTurnText = document.querySelector('.current-turn-text')
            currentTurnText.textContent = `Player ${currentPlayer}'s Turn`
        }
        
    },200);    
    
}

function getNextAvailableSlotForCol(colNum){
    let i = board1.length - 1
    while(i >= 0){
        if(board1[i][colNum] === 0){
            return i;
        }
        i--
    }

    return i

    
}

function getAvailableSlotsForAllCols(){
    let availableSlots = []
   
    for(let col = 0; col < board1[0].length; col++){
        let row = getNextAvailableSlotForCol(col)
        availableSlots.push([row,col])
    }

    return availableSlots
}

function isAvailableSlot(row,col){
    let availableSlots = getAvailableSlotsForAllCols()

    let result = availableSlots.filter((arr) => arr[0] === row && arr[1] === col)
    

    return result.length !== 0 
}



function setNextPlayer(){
    currentPlayer = currentPlayer === 1 ? 2 : 1;
   
}

function setupGrid(){
    let boardGrid = document.querySelector(".board-grid")
    let coinSlots = boardGrid.children
    for(let i = 0; i < coinSlots.length; i++){
        let rowNum = Math.floor(i / board1[0].length);
        let colNum = i % (board1[0].length);
        coinSlots[i].addEventListener("click",function(){
            if(isRunning){
                return;
            }

           if(isAvailableSlot(rowNum,colNum) && availableTime > 0){
                board1[rowNum][colNum] = currentPlayer
                setTimeout(() => {
                    isRunning = true
                    animateCoinSlots(rowNum,colNum,0,() => {
                
                        let num4InRow = check4InRow(rowNum,colNum)
                        if(num4InRow > 0){
                            updateScore(num4InRow)
                        }
                        isRunning = false;
                        setNextPlayer()
                        startClock()
                    })

                },500)

               
            }
           
        })
    }
}

resetScores()
setupGrid()
startClock()
