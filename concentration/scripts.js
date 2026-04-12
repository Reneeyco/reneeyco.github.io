/* ---------------- TP11: Re-Concentration ---------------- */

/* Select page elements */
const cards = document.querySelectorAll(".card");
const turnCounter = document.querySelector("#turnCounter");
const winPanel = document.querySelector("#winPanel");

/* Game variables */
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let turns = 0;
let matchedPairs = 0;

/* Shuffle cards when page loads */
shuffleCards();

/* Add click event to every card */
cards.forEach(function (card) {
    card.addEventListener("click", handleCardClick);
});

/* ---------------- CARD CLICK FUNCTION ---------------- */
function handleCardClick() {
    /* Stop if the board is locked */
    if (lockBoard) {
        return;
    }

    /* Stop if this card is already flipped */
    if (this.classList.contains("flipped")) {
        return;
    }

    /* Stop if this card is already matched */
    if (this.classList.contains("matched")) {
        return;
    }

    /* Flip the clicked card */
    this.classList.add("flipped");

    /* Save first card */
    if (firstCard === null) {
        firstCard = this;
        return;
    }

    /* Save second card */
    secondCard = this;

    /* Lock board so player cannot click more cards */
    lockBoard = true;

    /* Count the turn */
    turns++;
    turnCounter.innerHTML = "Turns: " + turns;

    /* Check if the two flipped cards match */
    checkForMatch();
}

/* ---------------- MATCH CHECK FUNCTION ---------------- */
function checkForMatch() {
    const firstPair = firstCard.dataset.pair;
    const secondPair = secondCard.dataset.pair;

    if (firstPair === secondPair) {
        handleMatch();
    } else {
        handleNoMatch();
    }
}

/* ---------------- IF THE CARDS MATCH ---------------- */
function handleMatch() {
    /* Add matched class so cards disappear */
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    /* Count completed matches */
    matchedPairs++;

    /* Reset card variables */
    resetTurn();

    /* If all 8 pairs are matched, show win panel */
    if (matchedPairs === 8) {
        winPanel.style.display = "block";
    }
}

/* ---------------- IF THE CARDS DO NOT MATCH ---------------- */
function handleNoMatch() {
    setTimeout(function () {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");

        resetTurn();
    }, 900);
}

/* ---------------- RESET TURN ---------------- */
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

/* ---------------- SHUFFLE FUNCTION ---------------- */
function shuffleCards() {
    cards.forEach(function (card) {
        let randomNumber = Math.floor(Math.random() * 16);
        card.style.order = randomNumber;
    });
}