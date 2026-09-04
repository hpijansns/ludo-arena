/* =====================================================
   LUDO ARENA - LUDO ENGINE
   Main Ludo Game Logic
   ===================================================== */

"use strict";


class LudoEngine {

    constructor() {

        /* ================= PLAYERS ================= */

        this.players = [
            "Red",
            "Green",
            "Yellow",
            "Blue"
        ];


        this.colors = [
            "red",
            "green",
            "yellow",
            "blue"
        ];


        /* ================= GAME STATE ================= */

        this.turn = 0;

        this.dice = 0;

        this.gameOver = false;


        /*
         * Each player has 4 tokens.
         *
         * -1  = Token is inside home
         *  0  = Token has entered the track
         *  1+ = Position on track
         * 56  = Finished
         */

        this.tokens = [

            [-1, -1, -1, -1],

            [-1, -1, -1, -1],

            [-1, -1, -1, -1],

            [-1, -1, -1, -1]

        ];


        /* ================= WIN STATE ================= */

        this.winner = null;

    }


    /* =================================================
       ROLL DICE
       ================================================= */

    roll() {

        if (this.gameOver) {

            return 0;

        }


        /*
         * A player cannot roll again
         * before completing the current move.
         */

        if (this.dice !== 0) {

            return this.dice;

        }


        this.dice =
            Math.floor(
                Math.random() * 6
            ) + 1;


        return this.dice;

    }


    /* =================================================
       CHECK TOKEN MOVE
       ================================================= */

    canMove(tokenIndex) {

        if (this.gameOver) {

            return false;

        }


        if (
            tokenIndex < 0 ||
            tokenIndex > 3
        ) {

            return false;

        }


        const position =
            this.tokens[
                this.turn
            ][tokenIndex];


        /*
         * Token already finished.
         */

        if (position >= 56) {

            return false;

        }


        /*
         * Token is inside home.
         *
         * It needs a 6 to come out.
         */

        if (position === -1) {

            return this.dice === 6;

        }


        /*
         * Normal movement.
         */

        return (
            position + this.dice <= 56
        );

    }


    /* =================================================
       GET MOVABLE TOKENS
       ================================================= */

    getMovableTokens() {

        const movable = [];


        for (
            let i = 0;
            i < 4;
            i++
        ) {

            if (
                this.canMove(i)
            ) {

                movable.push(i);

            }

        }


        return movable;

    }


    /* =================================================
       MOVE TOKEN
       ================================================= */

    move(tokenIndex) {

        if (
            !this.canMove(tokenIndex)
        ) {

            return false;

        }


        const playerTokens =
            this.tokens[
                this.turn
            ];


        const currentPosition =
            playerTokens[tokenIndex];


        /*
         * Token comes out of home
         * when dice is 6.
         */

        if (
            currentPosition === -1
        ) {

            playerTokens[tokenIndex] = 0;

        }
        else {

            playerTokens[tokenIndex] =
                currentPosition + this.dice;

        }


        /*
         * Capture opponent token.
         */

        this.captureOpponent(
            tokenIndex
        );


        /*
         * Check if player has won.
         */

        this.checkWinner();


        return true;

    }


    /* =================================================
       CAPTURE OPPONENT
       ================================================= */

    captureOpponent(tokenIndex) {

        const playerPosition =
            this.tokens[
                this.turn
            ][tokenIndex];


        /*
         * Do not capture while
         * token is at home.
         */

        if (
            playerPosition < 0
        ) {

            return;

        }


        /*
         * Safe final position.
         */

        if (
            playerPosition >= 56
        ) {

            return;

        }


        for (
            let player = 0;
            player < this.players.length;
            player++
        ) {

            /*
             * Don't compare with yourself.
             */

            if (
                player === this.turn
            ) {

                continue;

            }


            for (
                let token = 0;
                token < 4;
                token++
            ) {

                const opponentPosition =
                    this.tokens[
                        player
                    ][token];


                /*
                 * Same position =
                 * opponent token gets
                 * sent home.
                 */

                if (
                    opponentPosition ===
                    playerPosition
                ) {

                    this.tokens[
                        player
                    ][token] = -1;

                }

            }

        }

    }


    /* =================================================
       CHECK WINNER
       ================================================= */

    checkWinner() {

        const playerTokens =
            this.tokens[
                this.turn
            ];


        const finishedTokens =
            playerTokens.filter(
                function (position) {

                    return position >= 56;

                }
            ).length;


        if (
            finishedTokens === 4
        ) {

            this.winner =
                this.players[
                    this.turn
                ];

            this.gameOver = true;

            return true;

        }


        return false;

    }


    /* =================================================
       NEXT TURN
       ================================================= */

    next() {

        if (this.gameOver) {

            return;

        }


        /*
         * Rolling a 6 gives
         * another turn.
         */

        if (
            this.dice === 6
        ) {

            this.dice = 0;

            return this.turn;

        }


        this.dice = 0;


        this.turn =
            (
                this.turn + 1
            ) %
            this.players.length;


        return this.turn;

    }


    /* =================================================
       CURRENT PLAYER
       ================================================= */

    getCurrentPlayer() {

        return this.players[
            this.turn
        ];

    }


    /* =================================================
       RESET GAME
       ================================================= */

    reset() {

        this.turn = 0;

        this.dice = 0;

        this.gameOver = false;

        this.winner = null;


        this.tokens = [

            [-1, -1, -1, -1],

            [-1, -1, -1, -1],

            [-1, -1, -1, -1],

            [-1, -1, -1, -1]

        ];

    }


    /* =================================================
       GET GAME STATE
       ================================================= */

    getState() {

        return {

            turn: this.turn,

            player:
                this.getCurrentPlayer(),

            dice: this.dice,

            tokens:
                JSON.parse(
                    JSON.stringify(
                        this.tokens
                    )
                ),

            gameOver:
                this.gameOver,

            winner:
                this.winner

        };

    }

}