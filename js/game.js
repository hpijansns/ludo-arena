(function () {

    "use strict";


    /* =====================================================
       LUDO ARENA
       STANDALONE GAME CONTROLLER
       ===================================================== */


    /* =====================================================
       GAME STATE
       ===================================================== */

    let currentPlayer = 0;

    let diceValue = 0;

    let rolling = false;

    let gameOver = false;


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
       TOKENS

       -1  = Home
       0+  = Board position
       56  = Finished
       ===================================================== */

    const tokens = [

        [-1, -1, -1, -1],

        [-1, -1, -1, -1],

        [-1, -1, -1, -1],

        [-1, -1, -1, -1]

    ];


    /* =====================================================
       52 CELL BOARD PATH
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
       PLAYER START POSITIONS
       ===================================================== */

    const startOffsets = [

        0,
        13,
        26,
        39

    ];


    /* =====================================================
       DOM
       ===================================================== */

    let board;

    let dice;

    let rollButton;

    let mobileRollButton;

    let turnElement;

    let messageElement;

    let playersElement;


    /* =====================================================
       INITIALIZE
       ===================================================== */

    document.addEventListener(

        "DOMContentLoaded",

        initializeGame

    );


    function initializeGame() {

        board =
            document.getElementById("board");


        dice =
            document.getElementById("dice");


        rollButton =
            document.getElementById("roll");


        mobileRollButton =
            document.getElementById(
                "mobile-roll"
            );


        turnElement =
            document.getElementById("turn");


        messageElement =
            document.getElementById("message");


        playersElement =
            document.getElementById("players");


        if (!board) {

            console.error(
                "Ludo Arena: Board not found."
            );

            return;

        }


        if (!rollButton) {

            console.error(
                "Ludo Arena: Roll button not found."
            );

            return;

        }


        createBoard();

        renderGame();


        rollButton.addEventListener(

            "click",

            rollDice

        );


        if (mobileRollButton) {

            mobileRollButton.addEventListener(

                "click",

                rollDice

            );

        }


        board.addEventListener(

            "click",

            handleTokenClick

        );


        enableRoll();


        console.log(
            "Ludo Arena: Game initialized."
        );

    }


    /* =====================================================
       CREATE BOARD
       ===================================================== */

    function createBoard() {

        board.innerHTML = "";


        for (
            let row = 0;
            row < 15;
            row++
        ) {


            for (
                let col = 0;
                col < 15;
                col++
            ) {

                const cell =
                    document.createElement(
                        "div"
                    );


                cell.className =
                    "cell";


                cell.dataset.row =
                    row;


                cell.dataset.col =
                    col;


                /* RED */

                if (
                    row < 6 &&
                    col < 6
                ) {

                    cell.classList.add(
                        "red"
                    );

                }


                /* GREEN */

                else if (
                    row < 6 &&
                    col > 8
                ) {

                    cell.classList.add(
                        "green"
                    );

                }


                /* BLUE */

                else if (
                    row > 8 &&
                    col < 6
                ) {

                    cell.classList.add(
                        "blue"
                    );

                }


                /* YELLOW */

                else if (
                    row > 8 &&
                    col > 8
                ) {

                    cell.classList.add(
                        "yellow"
                    );

                }


                /* PATH */

                else {

                    cell.classList.add(
                        "path"
                    );

                }


                /* CENTER */

                if (

                    row >= 6 &&
                    row <= 8 &&
                    col >= 6 &&
                    col <= 8

                ) {

                    cell.classList.add(
                        "center"
                    );

                }


                board.appendChild(
                    cell
                );

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
       RENDER TURN
       ===================================================== */

    function renderTurn() {

        if (!turnElement) {

            return;

        }


        turnElement.textContent =

            icons[currentPlayer] +

            " " +

            players[currentPlayer] +

            "'s Turn";

    }


    /* =====================================================
       RENDER DICE
       ===================================================== */

    function renderDice() {

        if (!dice) {

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


        dice.textContent =

            faces[diceValue] ||

            "🎲";

    }


    /* =====================================================
       ROLL DICE
       ===================================================== */

    function rollDice() {

        if (
            rolling ||
            gameOver
        ) {

            return;

        }


        rolling = true;


        disableRoll();


        showMessage(
            "🎲 Rolling dice..."
        );


        if (dice) {

            dice.classList.add(
                "rolling"
            );

        }


        let count = 0;


        const animation =

            setInterval(

                function () {


                    const random =

                        Math.floor(
                            Math.random() * 6
                        ) + 1;


                    showDice(
                        random
                    );


                    count++;


                    if (
                        count >= 8
                    ) {

                        clearInterval(
                            animation
                        );


                        finishRoll();

                    }


                },

                80

            );

    }


    /* =====================================================
       FINISH ROLL
       ===================================================== */

    function finishRoll() {

        diceValue =

            Math.floor(
                Math.random() * 6
            ) + 1;


        if (dice) {

            dice.classList.remove(
                "rolling"
            );

        }


        renderDice();


        showMessage(

            icons[currentPlayer] +

            " " +

            players[currentPlayer] +

            " rolled " +

            diceValue +

            "."

        );


        const token =

            findMovableToken(

                currentPlayer,

                diceValue

            );


        if (
            token === -1
        ) {

            showMessage(

                icons[currentPlayer] +

                " " +

                players[currentPlayer] +

                " cannot move."

            );


            setTimeout(

                nextTurn,

                1000

            );


            return;

        }


        /*
         * Automatically move first
         * valid token.
         */

        setTimeout(

            function () {

                moveToken(

                    currentPlayer,

                    token,

                    diceValue

                );

            },

            500

        );

    }


    /* =====================================================
       FIND MOVABLE TOKEN
       ===================================================== */

    function findMovableToken(

        player,

        amount

    ) {


        for (

            let token = 0;

            token < 4;

            token++

        ) {

            const position =

                tokens[player][token];


            /*
             * Token at home.
             * Needs 6.
             */

            if (
                position === -1
            ) {

                if (
                    amount === 6
                ) {

                    return token;

                }


                continue;

            }


            /*
             * Already finished.
             */

            if (
                position >= 56
            ) {

                continue;

            }


            /*
             * Normal movement.
             */

            if (
                position + amount <= 56
            ) {

                return token;

            }

        }


        return -1;

    }


    /* =====================================================
       MOVE TOKEN
       ===================================================== */

    function moveToken(

        player,

        token,

        amount

    ) {


        const oldPosition =

            tokens[player][token];


        /*
         * HOME -> BOARD
         */

        if (
            oldPosition === -1
        ) {

            if (
                amount !== 6
            ) {

                nextTurn();

                return;

            }


            tokens[player][token] = 0;

        }


        /*
         * MOVE ON BOARD
         */

        else {

            tokens[player][token] =

                Math.min(

                    56,

                    oldPosition + amount

                );

        }


        renderTokens();

        renderPlayers();


        const newPosition =

            tokens[player][token];


        if (
            newPosition >= 56
        ) {

            showMessage(

                "🎉 " +

                players[player] +

                " Token " +

                (token + 1) +

                " finished!"

            );

        }

        else {

            showMessage(

                icons[player] +

                " " +

                players[player] +

                " Token " +

                (token + 1) +

                " moved " +

                amount +

                " step" +

                (
                    amount === 1
                        ? ""
                        : "s"
                ) +

                "."

            );

        }


        /*
         * WINNER
         */

        if (
            checkWinner(player)
        ) {

            return;

        }


        /*
         * SIX = EXTRA TURN
         */

        if (
            amount === 6
        ) {

            diceValue = 0;

            rolling = false;


            renderDice();


            enableRoll();


            showMessage(

                "🎉 " +

                players[player] +

                " rolled a 6. Roll again!"

            );


            return;

        }


        /*
         * NEXT PLAYER
         */

        setTimeout(

            nextTurn,

            900

        );

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

            icons[currentPlayer] +

            " " +

            players[currentPlayer] +

            "'s turn. Roll the dice."

        );

    }


    /* =====================================================
       WINNER
       ===================================================== */

    function checkWinner(
        player
    ) {

        const finished =

            tokens[player].filter(

                function (position) {

                    return position >= 56;

                }

            ).length;


        if (
            finished !== 4
        ) {

            return false;

        }


        gameOver = true;


        disableRoll();


        showMessage(

            "🏆 🎉 " +

            players[player] +

            " WINS!"

        );


        return true;

    }


    /* =====================================================
       TOKEN COORDINATES
       ===================================================== */

    function getTokenCoordinates(

        player,

        token

    ) {


        const position =

            tokens[player][token];


        const color =

            colors[player];


        /*
         * HOME
         */

        if (
            position === -1
        ) {

            return homePositions[
                color
            ][token];

        }


        /*
         * FINISHED
         */

        if (
            position >= 56
        ) {

            return [7, 7];

        }


        /*
         * MAIN PATH
         */

        const index =

            (

                startOffsets[player] +

                position

            ) % 52;


        return path[index];

    }


    /* =====================================================
       RENDER TOKENS
       ===================================================== */

    function renderTokens() {

        if (!board) {

            return;

        }


        board

            .querySelectorAll(
                ".ludo-token"
            )

            .forEach(

                function (element) {

                    element.remove();

                }

            );


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


                const coordinates =

                    getTokenCoordinates(

                        player,

                        token

                    );


                const row =
                    coordinates[0];


                const col =
                    coordinates[1];


                const cell =

                    board.querySelector(

                        `.cell[data-row="${row}"][data-col="${col}"]`

                    );


                if (!cell) {

                    continue;

                }


                const tokenElement =

                    document.createElement(
                        "div"
                    );


                tokenElement.className =

                    "ludo-token token-" +

                    colors[player];


                tokenElement.textContent =

                    icons[player];


                tokenElement.dataset.player =

                    player;


                tokenElement.dataset.token =

                    token;


                tokenElement.title =

                    players[player] +

                    " Token " +

                    (token + 1);


                cell.appendChild(
                    tokenElement
                );

            }

        }

    }


    /* =====================================================
       PLAYERS
       ===================================================== */

    function renderPlayers() {

        if (!playersElement) {

            return;

        }


        playersElement.innerHTML = "";


        for (

            let player = 0;

            player < 4;

            player++

        ) {


            const element =

                document.createElement(
                    "div"
                );


            element.className =

                "player " +

                colors[player] +

                "-player";


            if (
                player === currentPlayer
            ) {

                element.classList.add(
                    "active"
                );

            }


            element.innerHTML = `

                <strong>

                    ${icons[player]}

                    ${players[player]}

                </strong>

            `;


            playersElement.appendChild(
                element
            );

        }

    }


    /* =====================================================
       TOKEN CLICK
       ===================================================== */

    function handleTokenClick(
        event
    ) {


        const token =

            event.target.closest(
                ".ludo-toke
        ".ludo-token"
    );


    if (!token) {

        return;

    }


    if (
        rolling ||
        gameOver ||
        diceValue === 0
    ) {

        return;

    }


    const player =

        Number(
            token.dataset.player
        );


    const tokenIndex =

        Number(
            token.dataset.token
        );


    if (
        player !== currentPlayer
    ) {

        return;

    }


    const position =

        tokens[player][tokenIndex];


    /*
     * HOME TOKEN
     */

    if (
        position === -1 &&
        diceValue !== 6
    ) {

        showMessage(
            "❌ You need a 6 to bring the token out."
        );

        return;

    }


    /*
     * TOKEN CANNOT PASS FINISH
     */

    if (

        position >= 0 &&

        position + diceValue > 56

    ) {

        showMessage(
            "❌ This token cannot move."
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


/* =====================================================
   SHOW DICE
   ===================================================== */

function showDice(value) {

    if (!dice) {

        return;

    }


    const faces = {

        1: "⚀",
        2: "⚁",
        3: "⚂",
        4: "⚃",
        5: "⚄",
        6: "⚅"

    };


    dice.textContent =

        faces[value] || "🎲";

}


/* =====================================================
   SHOW MESSAGE
   ===================================================== */

function showMessage(text) {

    if (!messageElement) {

        return;

    }


    messageElement.textContent = text;

}


/* =====================================================
   ENABLE ROLL
   ===================================================== */

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
   DISABLE ROLL
   ===================================================== */

function disableRoll() {

    if (rollButton) {

        rollButton.disabled = true;

    }


    if (mobileRollButton) {

        mobileRollButton.disabled = true;

    }

}


/* =====================================================
   END GAME CONTROLLER
   ===================================================== */

})();
