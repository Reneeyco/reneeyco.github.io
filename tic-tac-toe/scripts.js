/* TP10: Click-Tac-Toe */

/* Game array */
let gameboard = ["", "", "", "", "", "", "", "", ""];

/* Keep track of current player */
let currentPlayer = "X";

/* Keep track of whether game has ended */
let gameOver = false;

/* Select page elements */
const spaces = document.querySelectorAll(".gameSpace");
const turnBox = document.querySelector("#turnBox");
const messageBox = document.querySelector("#messageBox");
const resetButton = document.querySelector("#resetButton");

/* This function checks for a win or draw */
function checkGameboard(boardArray) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < winningCombos.length; i++) {
        let combo = winningCombos[i];

        let a = combo[0];
        let b = combo[1];
        let c = combo[2];

        if (
            boardArray[a] !== "" &&
            boardArray[a] === boardArray[b] &&
            boardArray[b] === boardArray[c]
        ) {
            return boardArray[a];
        }
    }

    if (!boardArray.includes("")) {
        return "draw";
    }

    return "continue";
}

/* Update the turn display */
function updateTurnBox() {
    turnBox.innerHTML = `TURN: PLAYER ${currentPlayer}`;
}

/* What happens when player clicks a space */
function handleSpaceClick(event) {
    if (gameOver === true) {
        return;
    }

    let clickedSpace = event.target;
    let spaceIndex = clickedSpace.id.replace("space", "");

    if (gameboard[spaceIndex] !== "") {
        return;
    }

    gameboard[spaceIndex] = currentPlayer;
    clickedSpace.innerHTML = currentPlayer;

    console.log(gameboard);

    let gameResult = checkGameboard(gameboard);

    if (gameResult === "X" || gameResult === "O") {
        messageBox.innerHTML = `PLAYER ${gameResult} WINS!`;
        turnBox.innerHTML = "GAME OVER";
        gameOver = true;
        return;
    }

    if (gameResult === "draw") {
        messageBox.innerHTML = "IT'S A DRAW!";
        turnBox.innerHTML = "GAME OVER";
        gameOver = true;
        return;
    }

    if (currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }

    updateTurnBox();
    messageBox.innerHTML = "Keep going!";
}

/* Reset the game */
function resetGame() {
    gameboard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;

    spaces.forEach(function(space) {
        space.innerHTML = "";
    });

    updateTurnBox();
    messageBox.innerHTML = "Click a square to start!";
}

/* Add click event to each square */
spaces.forEach(function(space) {
    space.addEventListener("click", handleSpaceClick);
});

/* Add click event to reset button */
resetButton.addEventListener("click", resetGame);

/* Set initial turn text */
updateTurnBox();