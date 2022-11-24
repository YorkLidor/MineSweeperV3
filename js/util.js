'use strict'
function setMinesNegsCount(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

//Expand 
function neighborsExpand(el,cellI, cellJ) {
    console.log('el:', el)
    var negsArr = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            var elCell = document.getElementById(`${i}-${j}`)
            // if(gBoard[i][j].minesAroundCount === 0 ) {
            //     negsArr.push(gBoard[i][j])
            // }

            //Modal + gGame + Dom
            if(!gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true
                gGame.shownCount++
                elCell.className = 'cell-show'
            }
            if(gBoard[i][j].isMarked) {
                gBoard[i][j].isMarked = false
                gGame.markedCount--
                elCell.className = 'cell-show'
            } 
        }
    }
    chackWin()
    return negsArr
}

function onHandleKey(event, el, i, j) {
    if (!gGame.isOn) return
    //Strat timer
    if(gIsFirstClick) {
        resetTime()
        gTimeIntervalId = setInterval(setTime, 1000)
        gIsFirstClick = false
    }

    //Modal+Dom
    if (event.which === 3) {
        switch (el.className) {
            case 'cell-hide':
                el.className = 'cell-flag'
                gBoard[i][j].isMarked = true
                gGame.markedCount++
                break;
            case 'cell-flag':
                el.className = 'cell-hide'
                gBoard[i][j].isMarked = false
                gGame.markedCount--
                break;
            case 'cell-show':
                break;

        }
    }
    chackWin()
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Timer
var minutesLabel = document.getElementById("minutes")
var secondsLabel = document.getElementById("seconds")

function setTime() {
    ++gTotalSeconds
    secondsLabel.innerHTML = pad(gTotalSeconds % 60)
    minutesLabel.innerHTML = pad(parseInt(gTotalSeconds / 60))
}

function pad(val) {
    var valString = val + ""
    if (valString.length < 2) {
        return "0" + valString
    }
    else {
        return valString
    }
}

function resetTime() {
    clearInterval(gTimeIntervalId)
    gTotalSeconds = 0
    var minutesLabel = document.getElementById("minutes")
    var secondsLabel = document.getElementById("seconds")
    secondsLabel.innerHTML = "00"
    minutesLabel.innerHTML = "00"
}

function getArrOfNegs(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].gameElement === BALL) neighborsCount++
        }
    }
    return neighborsCount
}