/* =====================================================
   LUDO ARENA - GAME.JS
   Main Game Controller
   ===================================================== */

"use strict";


/* =====================================================
   GAME ENGINE
   ===================================================== */

const game =
    new LudoEngine();


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const board =
    document.getElementById("board");

const diceElement =
    document.getElementById("dice");

const rollButton =
    document.getElementById("roll");

const mobileRollButton =
    document.getElementById("mobile-roll");

const turnElement =
    document.getElementById("turn");

const messageElement =
    document.getElementById("message");

const playersElement =
    document.getElementById("players");


/* =====================================================
   INITIALIZE
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createBoard();

        renderGame();

    }
);


/* =====================================================
   BOARD
   ===================================================== */

function createBoard() {

    if (!board) {
        return;
    }

    board.innerHTML = "";

    for (let row = 0; row < 15; row++) {

        for (let col = 0; col < 15; col++) {

            const cell =
                document.createElement("div");

            cell.classList.add("cell");

            cell.dataset.row = row;
            cell.dataset.col = col;


            /*
             * Four home areas
             */

            if (row < 6 && col < 6) {

                cell.classList.add("red");

            }
            else if (row < 6 && col > 8) {

                cell.classList.add("green");

            }
            else if (row > 8 && col < 6) {

                cell.classList.add("blue");

            }
            else if (row > 8 && col > 8) {

                cell.classList.add("yellow");

            }
            else {

                cell.classList.add("path");

            }


            /*
             * Center area
             */

            if (
                row >= 6 &&
                row <= 8 &&
                col >= 6 &&
                col <= 8
            ) {

                cell.classList.add("center");

            }


            /*
             * Safe cells
             */

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

}


/* =====================================================
   RENDER GAME
   ===================================================== */

function renderGame() {

    renderTurn();

    renderDice();

    renderPlayers();

}


/* =====================================================
   TURN
   ===================================================== */

function renderTurn() {

    if (!turnElement) {
        return;
    }

    const player =
        game.players[game.turn];

    turnElement.textContent =
        `${player}'s Turn`;

}


/* =====================================================
   DICE
   ===================================================== */

function renderDice() {

    if (!diceElement) {
        return;
    }

    if (!game.dice) {

        diceElement.textContent = "🎲";

        return;

    }


    const diceFaces = {

        1: "⚀",
        2: "⚁",
        3: "⚂",
        4: "⚃",
        5: "⚄",
        6: "⚅"

    };


    diceElement.textContent =
        diceFaces[game.dice] || "🎲";

}


/* =====================================================
   ROLL DICE
   ===================================================== */

function rollDice() {

    if (game.dice !== 0) {

        return;

    }


    if (rollButton) {

        rollButton.disabled = true;

    }


    if (mobileRollButton) {

        mobileRollButton.disabled = true;

    }


    /*
     * Dice animation
     */

    if (diceElement) {

        diceElement.classList.add(
            "rolling"
        );

    }


    setTimeout(function () {

        const result =
            game.roll();


        renderDice();


        if (diceElement) {

            diceElement.classList.remove(
                "rolling"
            );

        }


        handleDiceResult(result);

    }, 450);

}


/* =====================================================
   HANDLE DICE RESULT
   ===================================================== */

function handleDiceResult(result) {

    const currentPlayer =
        game.players[game.turn];


    const movableTokens = [];


    for (
        let token = 0;
        token < 4;
        token++
    ) {

        if (
            game.canMove(token)
        ) {

            movableTokens.push(token);

        }

    }


    if (movableTokens.length === 0) {

        showMessage(
            `${currentPlayer} cannot move.`
        );


        setTimeout(function () {

            game.next();

            enableRoll();

            renderGame();

        }, 900);

        return;

    }


    /*
     * For the demo, automatically select
     * the first valid token.
     *
     * Later this can be replaced with
     * token-click selection.
     */

    const selectedToken =
        movableTokens[0];


    moveToken(
        selectedToken
    );

}


/* =====================================================
   MOVE TOKEN
   ===================================================== */

function moveToken(tokenIndex) {

    const player =
        game.players[game.turn];

    const diceValue =
        game.dice;


    const success =
        game.move(tokenIndex);


    if (!success) {

        showMessage(
            "This token cannot move."
        );

        enableRoll();

        return;

    }


    showMessage(
        `${player} moved Token ${tokenIndex + 1} by ${diceValue} space${diceValue > 1 ? "s" : ""}.`
    );


    renderPlayers();


    /*
     * Check winner
     */

    if (
        checkWinner()
    ) {

        return;

    }


    /*
     * Give next turn
     */

    setTimeout(function () {

        game.next();

        enableRoll();

        renderGame();

    }, 700);

}


/* =====================================================
   WINNER CHECK
   ===================================================== */

function checkWinner() {

    const currentTokens =
        game.tokens[game.turn];


    const finished =
        currentTokens.filter(
            function (position) {

                return position >= 56;

            }
        ).length;


    if (finished === 4) {

        const winner =
            game.players[game.turn];


        showMessage(
            `🎉 ${winner} wins the game!`
        );


        if (typeof addWin === "function") {

            addWin();

        }


        if (typeof addPoints === "function") {

            addPoints(100);

        }


        if (typeof addGame === "function") {

            addGame();

        }


        if (rollButton) {

            rollButton.disabled = true;

        }


        if (mobileRollButton) {

            mobileRollButton.disabled = true;

        }


        return true;

    }


    return false;

}


/* =====================================================
   ENABLE ROLL
   ===================================================== */

function enableRoll() {

    if (rollButton) {

        rollButton.disabled = false;

    }

    if (mobileRollButton) {

        mobileRollButton.disabled = false;

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
   PLAYERS
   ===================================================== */

function renderPlayers() {

    if (!playersElement) {

        return;

    }


    playersElement.innerHTML = "";


    game.players.forEach(
        function (player, index) {

            const playerElement =
                document.createElement("div");


            playerElement.classList.add(
                "player"
            );


            playerElement.classList.add(
                `${game.colors[index]}-player`
            );


            if (
                index === game.turn
            ) {

                playerElement.classList.add(
                    "active"
                );

            }


            const tokens =
                game.tokens[index];


            playerElement.innerHTML = `
                <strong>${getPlayerIcon(index)} ${player}</strong>
                <br>
                <small>
                    ${formatTokens(tokens)}
                </small>
            `;


            playersElement.appendChild(
                playerElement
            );

        }
    );

}


/* =====================================================
   PLAYER ICON
   ===================================================== */

function getPlayerIcon(index) {

    const icons = [
        "🔴",
        "🟢",
        "🟡",
        "🔵"
    ];

    return icons[index] || "⚪";

}


/* =====================================================
   TOKEN TEXT
   ===================================================== */

function formatTokens(tokens) {

    return tokens.map(
        function (position, index) {

            let value;


            if (position === -1) {

                value = "Home";

            }
            else if (position >= 56) {

                value = "Finished";

            }
            else {

                value = position;

            }


            return `T${index + 1}: ${value}`;

        }
    ).join(" · ");

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