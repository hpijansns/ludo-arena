/* =====================================================
   LUDO ARENA - BOARD.JS
   Board Creation & Board Helpers
   ===================================================== */

"use strict";


/* =====================================================
   BOARD CONSTANTS
   ===================================================== */

const BOARD_SIZE = 15;

const TOTAL_CELLS =
    BOARD_SIZE * BOARD_SIZE;


/* =====================================================
   BOARD ELEMENT
   ===================================================== */

function getBoardElement() {

    return document.getElementById("board");

}


/* =====================================================
   CREATE BOARD
   ===================================================== */

function createLudoBoard() {

    const board =
        getBoardElement();


    if (!board) {

        return;

    }


    board.innerHTML = "";


    /*
     * Create 15 × 15 = 225 cells.
     */

    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        for (
            let col = 0;
            col < BOARD_SIZE;
            col++
        ) {

            const cell =
                document.createElement("div");


            cell.classList.add(
                "cell"
            );


            cell.dataset.row = row;

            cell.dataset.col = col;


            applyCellType(
                cell,
                row,
                col
            );


            board.appendChild(
                cell
            );

        }

    }

}


/* =====================================================
   CELL TYPE
   ===================================================== */

function applyCellType(
    cell,
    row,
    col
) {


    /*
     * RED HOME
     */

    if (
        row < 6 &&
        col < 6
    ) {

        cell.classList.add(
            "red"
        );

        return;

    }


    /*
     * GREEN HOME
     */

    if (
        row < 6 &&
        col > 8
    ) {

        cell.classList.add(
            "green"
        );

        return;

    }


    /*
     * BLUE HOME
     */

    if (
        row > 8 &&
        col < 6
    ) {

        cell.classList.add(
            "blue"
        );

        return;

    }


    /*
     * YELLOW HOME
     */

    if (
        row > 8 &&
        col > 8
    ) {

        cell.classList.add(
            "yellow"
        );

        return;

    }


    /*
     * CENTER
     */

    if (
        row >= 6 &&
        row <= 8 &&
        col >= 6 &&
        col <= 8
    ) {

        cell.classList.add(
            "center"
        );

        return;

    }


    /*
     * NORMAL PATH
     */

    cell.classList.add(
        "path"
    );


    /*
     * Safe positions
     */

    if (
        isSafeCell(row, col)
    ) {

        cell.classList.add(
            "safe"
        );

    }

}


/* =====================================================
   SAFE CELL
   ===================================================== */

function isSafeCell(
    row,
    col
) {

    const safeCells = [

        "6-1",
        "1-8",
        "8-13",
        "13-6",

        /*
         * Additional common
         * safe positions.
         */

        "2-6",
        "6-12",
        "12-8",
        "8-2"

    ];


    return safeCells.includes(
        `${row}-${col}`
    );

}


/* =====================================================
   GET CELL
   ===================================================== */

function getBoardCell(
    row,
    col
) {

    const board =
        getBoardElement();


    if (!board) {

        return null;

    }


    return board.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
    );

}


/* =====================================================
   CLEAR TOKENS
   ===================================================== */

function clearBoardTokens() {

    const board =
        getBoardElement();


    if (!board) {

        return;

    }


    const tokens =
        board.querySelectorAll(
            ".token"
        );


    tokens.forEach(
        function (token) {

            token.remove();

        }
    );

}


/* =====================================================
   CREATE TOKEN ELEMENT
   ===================================================== */

function createTokenElement(
    playerIndex,
    tokenIndex
) {

    const token =
        document.createElement("div");


    token.classList.add(
        "token"
    );


    const colors = [
        "red",
        "green",
        "yellow",
        "blue"
    ];


    const color =
        colors[playerIndex] ||
        "red";


    token.classList.add(
        `t-${color}`
    );


    token.dataset.player =
        playerIndex;


    token.dataset.token =
        tokenIndex;


    token.title =
        `${color} Token ${tokenIndex + 1}`;


    return token;

}


/* =====================================================
   HOME TOKEN POSITION
   ===================================================== */

function getHomePosition(
    playerIndex,
    tokenIndex
) {

    const positions = [

        /*
         * RED
         */

        [
            [1, 1],
            [1, 4],
            [4, 1],
            [4, 4]
        ],


        /*
         * GREEN
         */

        [
            [1, 10],
            [1, 13],
            [4, 10],
            [4, 13]
        ],


        /*
         * BLUE
         */

        [
            [10, 1],
            [10, 4],
            [13, 1],
            [13, 4]
        ],


        /*
         * YELLOW
         */

        [
            [10, 10],
            [10, 13],
            [13, 10],
            [13, 13]
        ]

    ];


    if (
        !positions[playerIndex] ||
        !positions[playerIndex][tokenIndex]
    ) {

        return null;

    }


    return {
        row:
            positions[playerIndex][tokenIndex][0],

        col:
            positions[playerIndex][tokenIndex][1]

    };

}


/* =====================================================
   PLACE TOKEN IN HOME
   ===================================================== */

function placeTokenInHome(
    playerIndex,
    tokenIndex
) {

    const position =
        getHomePosition(
            playerIndex,
            tokenIndex
        );


    if (!position) {

        return;

    }


    const cell =
        getBoardCell(
            position.row,
            position.col
        );


    if (!cell) {

        return;

    }


    const token =
        createTokenElement(
            playerIndex,
            tokenIndex
        );


    cell.appendChild(
        token
    );

}


/* =====================================================
   CENTER POSITION
   ===================================================== */

function showWinnerAtCenter(
    playerIndex
) {

    const board =
        getBoardElement();


    if (!board) {

        return;

    }


    const center =
        getBoardCell(
            7,
            7
        );


    if (!center) {

        return;

    }


    const winner =
        document.createElement(
            "div"
        );


    winner.classList.add(
        "winner-token"
    );


    const colors = [
        "red",
        "green",
        "yellow",
        "blue"
    ];


    winner.classList.add(
        `t-${colors[playerIndex]}`
    );


    winner.textContent =
        "🏆";


    center.appendChild(
        winner
    );

}


/* =====================================================
   INITIAL BOARD SETUP
   ===================================================== */

function initializeBoard() {

    createLudoBoard();


    /*
     * Add four tokens for
     * each player to home.
     */

    for (
        let player = 0;
        player < 4;
        player++
    ) {

        for (
            let token = 0;
            token < 4;
            token++
        ) {

            placeTokenInHome(
                player,
                token
            );

        }

    }

}


/* =====================================================
   AUTO INITIALIZE
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Only initialize when
         * a board exists.
         */

        if (
            getBoardElement()
        ) {

            initializeBoard();

        }

    }
);