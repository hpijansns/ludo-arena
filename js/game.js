/* =====================================================
   LUDO ARENA
   GAME.JS - COMPLETE WORKING GAME CONTROLLER
   ===================================================== */

"use strict";

/* =====================================================
   DOM
   ===================================================== */

const board = document.getElementById("board");
const diceElement = document.getElementById("dice");
const rollButton = document.getElementById("roll");
const mobileRollButton = document.getElementById("mobile-roll");
const turnElement = document.getElementById("turn");
const messageElement = document.getElementById("message");
const playersElement = document.getElementById("players");


/* =====================================================
   PLAYERS
   ===================================================== */

const players = [
    "Red",
    "Green",
    "Yellow",
    "Blue"
];

const colors = [
    "red",
    "green",
    "yellow",
    "blue"
];

const icons = [
    "🔴",
    "🟢",
    "🟡",
    "🔵"
];


/* =====================================================
   GAME STATE
   ===================================================== */

let currentPlayer = 0;

let diceValue = 0;

let rolling = false;

let gameOver = false;


/*
   -1 = token at home
    0-51 = normal board
   52-56 = home lane / finish
*/

const tokens = [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1]
];


/* =====================================================
   BOARD PATH
   52 MAIN CELLS
   ===================================================== */

const path = [

    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
    [6, 5],

    [5, 6],
    [4, 6],
    [3, 6],
    [2, 6],
    [1, 6],
    [0, 6],

    [0, 7],
    [0, 8],

    [1, 8],
    [2, 8],
    [3, 8],
    [4, 8],
    [5, 8],

    [6, 9],
    [6, 10],
    [6, 11],
    [6, 12],
    [6, 13],
    [6, 14],

    [7, 14],
    [8, 14],

    [8, 13],
    [8, 12],
    [8, 11],
    [8, 10],
    [8, 9],

    [9, 8],
    [10, 8],
    [11, 8],
    [12, 8],
    [13, 8],
    [14, 8],

    [14, 7],
    [14, 6],

    [13, 6],
    [12, 6],
    [11, 6],
    [10, 6],
    [9, 6],

    [8, 5],
    [8, 4],
    [8, 3],
    [8, 2],
    [8, 1],

    [8, 0],
    [7, 0],
    [6, 0]

];


/* =====================================================
   HOME POSITIONS
   ===================================================== */

const homePositions = {

    red: [
        [1, 1],
        [1, 4],
        [4, 1],
        [4, 4]
    ],

    green: [
        [1, 10],
        [1, 13],
        [4, 10],
        [4, 13]
    ],

    blue: [
        [10, 1],
        [10, 4],
        [13, 1],
        [13, 4]
    ],

    yellow: [
        [10, 10],
        [10, 13],
        [13, 10],
        [13, 13]
    ]

};


/* =====================================================
   PLAYER START OFFSETS
   ===================================================== */

const startOffsets = [
    0,   // Red
    13,  // Green
    26,  // Yellow
    39   // Blue
];


/* =====================================================
   DOM READY
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    createBoard();

    renderPlayers();

    renderTurn();

    renderDice();

    renderTokens();

    enableRoll();

});


/* =====================================================
   CREATE BOARD
   ===================================================== */

function createBoard() {

    if (!board) {
        return;
    }

    board.innerHTML = "";

    for (let row = 0; row < 15; row++) {

        for (let col = 0; col < 15; col++) {

            const cell = document.createElement("div");

            cell.className = "cell";

            cell.dataset.row = row;
            cell.dataset.col = col;


            /* RED HOME */

            if (row < 6 && col < 6) {

                cell.classList.add("red");

            }


            /* GREEN HOME */

            else if (row < 6 && col > 8) {

                cell.classList.add("green");

            }


            /* BLUE HOME */

            else if (row > 8 && col < 6) {

                cell.classList.add("blue");

            }


            /* YELLOW HOME */

            else if (row > 8 && col > 8) {

                cell.classList.add("yellow");

            }


            /* PATH */

            else {

                cell.classList.add("path");

            }


            /* CENTER */

            if (
                row >= 6 &&
                row <= 8 &&
                col >= 6 &&
                col <= 8
            ) {

                cell.classList.add("center");

            }


            /* SAFE */

            if (
                (row === 6 && col === 1) ||
                (row === 1 && col === 8) ||
                (row === 8 && col === 13) ||
                (row === 13 && col === 6)
            ) {

                cell.classList.add("safe");

            }


            board.appendChild(cell);

        }

    }


    renderTokens();

}


/* =====================================================
   GET CELL
   ===================================================== */

function getCell(row, col) {

    if (!board) {
        return null;
    }

    return board.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
    );

}


/* =====================================================
   GET TOKEN POSITION
   ===================================================== */

function getTokenCoordinates(player, token) {

    const position = tokens[player][token];

    const color = colors[player];


    /* TOKEN AT HOME */

    if (position === -1) {

        return homePositions[color][token];

    }


    /* FINISHED */

    if (position >= 56) {

        return [7, 7];

    }


    /* NORMAL PATH */

    const index =
        (startOffsets[player] + position) % 52;

    return path[index];

}


/* =====================================================
   RENDER TOKENS
   ===================================================== */

function renderTokens() {

    if (!board) {
        return;
    }


    /* Remove old tokens */

    board
        .querySelectorAll(".ludo-token")
        .forEach(function (token) {

            token.remove();

        });


    /* Draw all tokens */

    for (let player = 0; player < 4; player++) {

        for (let token = 0; token < 4; token++) {

            const coordinates =
                getTokenCoordinates(player, token);

            const row = coordinates[0];
            const col = coordinates[1];

            const cell =
                getCell(row, col);


            if (!cell) {
                continue;
            }


            const tokenElement =
                document.createElement("div");

            tokenElement.className =
                `ludo-token token-${colors[player]}`;


            tokenElement.textContent =
                icons[player];


            tokenElement.dataset.player =
                player;

            tokenElement.dataset.token =
                token;


            tokenElement.title =
                `${players[player]} Token ${token + 1}`;


            /*
             * If multiple tokens occupy same cell,
             * make them slightly smaller.
             */

            const existing =
                cell.querySelectorAll(".ludo-token").length;


            if (existing > 0) {

                tokenElement.classList.add(
                    "stacked"
                );

            }


            cell.appendChild(tokenElement);

        }

    }

}


/* =====================================================
   RENDER GAME
   ===================================================== */

function renderGame() {

    renderTurn();

    renderDice();

    renderPlayers();

    renderTokens();

}


/* =====================================================
   TURN
   ===================================================== */

function renderTurn() {

    if (!turnElement) {
        return;
    }

    turnElement.textContent =
        `${icons[currentPlayer]} ${players[currentPlayer]}'s Turn`;

}


/* =====================================================
   DICE
   ===================================================== */

function renderDice() {

    if (!diceElement) {
        return;
    }


    const faces = {

        0: "🎲",
        1: "⚀",
        2: "⚁",
        3: "⚂",
        4: "⚃",
        5: "⚄",
        6: "⚅"

    };


    diceElement.textContent =
        faces[diceValue] || "🎲";

}


/* =====================================================
   ROLL DICE
   ===================================================== */

function rollDice() {

    if (rolling || gameOver) {
        return;
    }


    rolling = true;

    disableRoll();


    if (diceElement) {

        diceElement.classList.add("rolling");

    }


    showMessage("🎲 Rolling dice...");


    /*
     * Small animation
     */

    let animationCount = 0;


    const animation =
        setInterval(function () {

            const random =
                Math.floor(Math.random() * 6) + 1;

            if (diceElement) {

                const faces = [
                    "⚀",
                    "⚁",
                    "⚂",
                    "⚃",
                    "⚄",
                    "⚅"
                ];

                diceElement.textContent =
                    faces[random - 1];

            }


            animationCount++;


            if (animationCount >= 8) {

                clearInterval(animation);

                finishRoll();

            }

        }, 70);

}


/* =====================================================
   FINISH ROLL
   ===================================================== */

function finishRoll() {

    diceValue =
        Math.floor(Math.random() * 6) + 1;


    if (diceElement) {

        diceElement.classList.remove(
            "rolling"
        );

    }


    renderDice();


    showMessage(
        `${icons[currentPlayer]} ${players[currentPlayer]} rolled ${diceValue}.`
    );


    /*
     * Find movable token
     */

    const movableToken =
        findMovableToken(currentPlayer, diceValue);


    if (movableToken === -1) {

        showMessage(
            `${icons[currentPlayer]} ${players[currentPlayer]} rolled ${diceValue}. No token can move.`
        );


        setTimeout(function () {

            nextTurn();

        }, 1000);

        return;

    }


    /*
     * Automatically move first valid token.
     */

    setTimeout(function () {

        moveToken(
            currentPlayer,
            movableToken,
            diceValue
        );

    }, 500);

}


/* =====================================================
   FIND MOVABLE TOKEN
   ===================================================== */

function findMovableToken(player, dice) {

    for (let token = 0; token < 4; token++) {

        const position =
            tokens[player][token];


        /*
         * Home token requires 6
         */

        if (position === -1) {

            if (dice === 6) {

                return token;

            }

            continue;

        }


        /*
         * Finished token cannot move
         */

        if (position >= 56) {
            continue;
        }


        /*
         * Prevent going beyond finish
         */

        if (position + dice <= 56) {

            return token;

        }

    }


    return -1;

}


/* =====================================================
   MOVE TOKEN
   ===================================================== */

function moveToken(player, token, dice) {

    const oldPosition =
        tokens[player][token];


    /*
     * Bring token out on 6
     */

    if (oldPosition === -1) {

        if (dice !== 6) {

            nextTurn();

            return;

        }


        tokens[player][token] = 0;

    }


    else {

        tokens[player][token] =
            Math.min(
                56,
                oldPosition + dice
            );

    }


    renderTokens();

    renderPlayers();


    const newPosition =
        tokens[player][token];


    /*
     * Finished
     */

    if (newPosition >= 56) {

        showMessage(
            `🎉 ${players[player]} Token ${token + 1} reached home!`
        );

    }

    else {

        showMessage(
            `${icons[player]} ${players[player]} Token ${token + 1} moved ${dice} step${dice > 1 ? "s" : ""}.`
        );

    }


    /*
     * Winner
     */

    if (checkWinner(player)) {

        return;

    }


    /*
     * Six gives another chance
     */

    if (dice === 6) {

        diceValue = 0;

        renderDice();

        rolling = false;

        enableRoll();

        renderTurn();

        showMessage(
            `🎉 ${players[player]} rolled a 6 — roll again!`
        );

        return;

    }


    /*
     * Next player
     */

    setTimeout(function () {

        nextTurn();

    }, 900);

}


/* =====================================================
   NEXT TURN
   ===================================================== */

function nextTurn() {

    diceValue = 0;

    currentPlayer =
        (currentPlayer + 1) % 4;


    rolling = false;


    renderGame();

    enableRoll();


    showMessage(
        `${icons[currentPlayer]} ${players[currentPlayer]}'s turn. Roll the dice.`
    );

}


/* =====================================================
   WINNER
   ===================================================== */

function checkWinner(player) {

    const finished =
        tokens[player].filter(function (position) {

            return position >= 56;

        }).length;


    if (finished !== 4) {

        return false;

    }


    gameOver = true;


    showMessage(
        `🏆 🎉 ${players[player]} wins the game!`
    );


    disableRoll();


    /*
     * Existing profile functions
     */

    if (typeof addWin === "function") {

        try {
            addWin();
        } catch (e) {
            console.log(e);
        }

    }


    if (typeof addPoints === "function") {

        try {
            addPoints(100);
        } catch (e) {
            console.log(e);
        }

    }


    if (typeof addGame === "function") {

        try {
            addGame();
        } catch (e) {
            console.log(e);
        }

    }


    return true;

}


/* =====================================================
   RENDER PLAYERS
   ===================================================== */

function renderPlayers() {

    if (!playersElement) {
        return;
    }


    playersElement.innerHTML = "";


    for (let player = 0; player < 4; player++) {

        const element =
            document.createElement("div");


        element.className =
            `player ${colors[player]}-player`;


        if (player === currentPlayer) {

            element.classList.add("active");

        }


        const tokenText =
            tokens[player]
                .map(function (position, index) {

                    let status;

                    if (position === -1) {

                        status = "Home";

                    }

                    else if (position >= 56) {

                        status = "Finished";

                    }

                    else {

                        status = position;

                    }

                    return `T${index + 1}: ${status}`;

                })
                .join(" · ");


        element.innerHTML = `
            <strong>
                ${icons[player]} ${players[player]}
            </strong>

            <small>
                ${tokenText}
            </small>
        `;


        playersElement.appendChild(element);

    }

}


/* =====================================================
   MESSAGE
   ===================================================== */

function showMessage(text) {

    if (!messageElement) {
        return;
    }

    messageElement.textContent =
        text;

}


/* =====================================================
   BUTTON STATE
   ===================================================== */

function disableRoll() {

    if (rollButton) {

        rollButton.disabled = true;

    }


    if (mobileRollButton) {

        mobileRollButton.disabled = true;

    }

}


function enableRoll() {

    if (gameOver) {
        return;
    }


    if (rollButton) {

        rollButton.disabled = false;

    }


    if (mobileRollButton) {

        mobileRollButton.disabled = false;

    }

}


/* =====================================================
   BUTTON EVENTS
   ===================================================== */

if (rollButton) {

    rollButton.addEventListener(
        "click",
        rollDice
    );

}


if (mobileRollButton) {

    mobileRollButton.addEventListener(
        "click",
        rollDice
    );

}


/* =====================================================
   TOKEN CLICK
   ===================================================== */

if (board) {

    board.addEventListener(
        "click",
        function (event) {

            const token =
                event.target.closest(".ludo-token");


            if (!token) {
                return;
            }


            const player =
                Number(token.dataset.player);


            const tokenIndex =
                Number(token.dataset.token);


            if (player !== currentPlayer) {

                return;

            }


            if (diceValue === 0) {

                return;

            }


            if (rolling) {

                return;

            }


            const position =
                tokens[player][tokenIndex];


            if (position === -1 && diceValue !== 6) {

                showMessage(
                    "❌ Token needs a 6 to come out."
                );

                return;

            }


            if (
                position >= 0 &&
                position + diceValue > 56
            ) {

                showMessage(
                    "❌ This token cannot move that far."
                );

                return;

            }


            rolling = true;

            disableRoll();


            moveToken(
                player,
                tokenIndex,
                diceValue
            );

        }
    );

}


/* =====================================================
   DEBUG
   ===================================================== */

console.log(
    "✅ Ludo Arena Game Controller Loaded"
);
