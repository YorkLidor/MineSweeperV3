'use strict'
var gBoard
var gLevel = { SIZE: 4, MINES: 2, LIVES: 1, HINTS: 3 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 3 }
var MINE = '💣'
var gStartTime
var gTimeIntervalId
var gFirstRightClick = true
var gCurrLives = 1
var gTotalSeconds = 0
var gIsFirstClick = true

// cell = { minesAroundCount: 1, isShown: false,
//     isMine: false, isMarked: false, location:{ i: i, j: j }}

function initGame() {
    resetTime()
    gIsFirstClick = true
    gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 1 }
    //Modal
    gBoard = buildBoard(gLevel.SIZE)
    //Dom
    renderBoard(gBoard)
    gGame.isOn = true
}

function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            var cell = { minesAroundCount: 55, isShown: false, isMine: false, isMarked: false, location: { i: i, j: j }, }
            board[i][j] = cell
            board[i][j].location.i = i
            board[i][j].location.j = j
        }
        console.log(board)
    }

    //Set random mines 
    setRandomMines(board, size)
    //Set Negs
    setMines(size, board)

    return board
}

function setRandomMines(board, size, row, col) {
    var minesInBoard = gLevel.MINES
    for (var i = 0; i < minesInBoard; i++) {
        var randomI = getRandomInt(0, size)
        var randomJ = getRandomInt(0, size)
        if (board[randomI][randomJ].isMine) {
            minesInBoard++
        } else {
            board[randomI][randomJ].isMine = true
        }
    }
}

function setMines(size, board) {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var CellObg = board[i][j]
            var minesAroundCel = setMinesNegsCount(i, j, board)
            if (CellObg.isMine) minesAroundCel = MINE
            CellObg.minesAroundCount = minesAroundCel
        }
    }
}

function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            var CellObg = gBoard[i][j]
            var minesAround = CellObg.minesAroundCount

            strHTML += `<td id="${i}-${j}" data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j}, ${CellObg.isMine})" 
                class="cell-hide" onmouseup="onHandleKey(event,this,${i},${j})">${minesAround}</td>`

        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
    livesLeft()
}

function onCellClicked(el, i, j) {
    //Stop All if LOSE/WIN
    if (!gGame.isOn) return

    //Start Timer
    if (gIsFirstClick) {
        gTimeIntervalId = setInterval(setTime, 1000)
        gIsFirstClick = false
        // setRandomMines(gBoard, gLevel.SIZE)
    }

    //Expand
    if (+el.innerText === 0 && el.className != 'cell-flag') {
        neighborsExpand(el, i, j)
    } else {
        //Modal + Dom
        switch (el.className) {
            case 'cell-hide':
                el.className = 'cell-show'
                gBoard[i][j].isShown = true
                gGame.shownCount++
                break;
            case 'cell-flag':
                break;
            case 'cell-show':
                break;
        }
    }

    //chack WIN/LOSE
    chackLose(i, j, el)
    gameEmojiChange(gBoard, i, j, el)
    chackWin()

}

function chackLose(i, j, el) {
    if (gBoard[i][j].isMine && el.className != 'cell-flag') {
        gLevel.LIVES--
        livesLeft()
    }
    if (gBoard[i][j].isMine && el.className != 'cell-flag' && gLevel.LIVES === 0) {
        clearInterval(gTimeIntervalId)
        gGame.isOn = false
    }
}


function levelChoose(size, mines, lives) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    gLevel.LIVES = lives
    gCurrLives = lives
    restartGame()
}

function gameWin() {
    document.querySelector('.face-img').src = "./img/winFace.png"
    clearInterval(gTimeIntervalId)
    gGame.isOn = false
}

function chackWin() {
    if (gLevel.SIZE ** 2 - gLevel.MINES === gGame.shownCount && gLevel.MINES === gGame.markedCount) {
        gameWin()
    }
}

function getTdFromCell(cell) {
    const i = cell.location.i
    const j = cell.location.j
    const td = document.getElementById(`${i}-${j}`)
    return td
}

function getCellFromTd(elTd) {
    const cellIdxI = elTd.dataset.i
    const cellIdxJ = elTd.dataset.j
    const cell = gBoard[cellIdxI][cellIdxJ]
    return cell
}

//life insert
function livesLeft() {
    if (gLevel.LIVES === 0) {
        document.querySelector('.lives').innerText = '❌'
    } else if (gLevel.LIVES === 1) {
        document.querySelector('.lives').innerText = '💖'
    } else if (gLevel.LIVES === 2) {
        document.querySelector('.lives').innerText = '💖💖'
    } else if (gLevel.LIVES === 3) {
        document.querySelector('.lives').innerText = '💖💖💖'
    }
}

function gameEmojiChange(board, i, j, el) {
    if (gLevel.LIVES === 0) {
        document.querySelector('.face-img').src = "./img/sadFace.png"
    } else if (board[i][j].isMine && gLevel.LIVES != 0 && el.className != 'cell-flag') {
        document.querySelector('.face-img').src = "./img/confusedFace.png"
        setTimeout(() => {
            document.querySelector('.face-img').src = "./img/happyFace.png"
        }, 500)
    }
}

function restartGame() {
    initGame()
    gLevel.LIVES = gCurrLives
    console.log('gCurrLives:', gCurrLives)
    document.querySelector('.face-img').src = "./img/happyFace.png"
    if (gCurrLives === 1) {
        document.querySelector('.lives').innerText = '💖'
    } else if (gCurrLives === 2) {
        document.querySelector('.lives').innerText = '💖💖'
    } else if (gCurrLives === 3) {
        document.querySelector('.lives').innerText = '💖💖💖'
    }
}

function hintClick() {
    if(gLevel.HINTS!=0) {
        gLevel.HINTS--
        return true
    } else return false
}
