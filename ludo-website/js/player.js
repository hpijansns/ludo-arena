/* =====================================================
   LUDO ARENA - PLAYER.JS
   Player Model & Player Helpers
   ===================================================== */

"use strict";


/* =====================================================
   PLAYER CLASS
   ===================================================== */

class LudoPlayer {

    constructor(
        id,
        name,
        color
    ) {

        this.id = id;

        this.name = name;

        this.color = color;


        /*
         * Every player starts
         * with four tokens at home.
         *
         * -1 = Home
         *  0+ = Track position
         */

        this.tokens = [
            -1,
            -1,
            -1,
            -1
        ];


        /* Statistics */

        this.games = 0;

        this.wins = 0;

        this.points = 0;

    }


    /* =================================================
       TOKEN HELPERS
       ================================================= */

    getToken(
        tokenIndex
    ) {

        if (
            tokenIndex < 0 ||
            tokenIndex >= 4
        ) {

            return null;

        }


        return this.tokens[
            tokenIndex
        ];

    }


    setToken(
        tokenIndex,
        position
    ) {

        if (
            tokenIndex < 0 ||
            tokenIndex >= 4
        ) {

            return false;

        }


        this.tokens[
            tokenIndex
        ] = position;


        return true;

    }


    /* =================================================
       HOME TOKENS
       ================================================= */

    getHomeTokens() {

        return this.tokens.filter(
            function (position) {

                return position === -1;

            }
        ).length;

    }


    /* =================================================
       FINISHED TOKENS
       ================================================= */

    getFinishedTokens() {

        return this.tokens.filter(
            function (position) {

                return position >= 56;

            }
        ).length;

    }


    /* =================================================
       CHECK WIN
       ================================================= */

    hasWon() {

        return (
            this.getFinishedTokens() === 4
        );

    }


    /* =================================================
       ADD WIN
       ================================================= */

    addWin(
        points = 100
    ) {

        this.wins++;

        this.points += Number(points) || 0;

    }


    /* =================================================
       ADD GAME
       ================================================= */

    addGame() {

        this.games++;

    }


    /* =================================================
       RESET TOKENS
       ================================================= */

    resetTokens() {

        this.tokens = [
            -1,
            -1,
            -1,
            -1
        ];

    }


    /* =================================================
       GET PLAYER DATA
       ================================================= */

    getData() {

        return {

            id: this.id,

            name: this.name,

            color: this.color,

            tokens: [
                ...this.tokens
            ],

            games: this.games,

            wins: this.wins,

            points: this.points

        };

    }

}


/* =====================================================
   DEFAULT PLAYERS
   ===================================================== */

function createDefaultPlayers() {

    return [

        new LudoPlayer(
            0,
            "Red",
            "red"
        ),

        new LudoPlayer(
            1,
            "Green",
            "green"
        ),

        new LudoPlayer(
            2,
            "Yellow",
            "yellow"
        ),

        new LudoPlayer(
            3,
            "Blue",
            "blue"
        )

    ];

}


/* =====================================================
   PLAYER ICON
   ===================================================== */

function getPlayerIcon(
    playerIndex
) {

    const icons = [

        "🔴",

        "🟢",

        "🟡",

        "🔵"

    ];


    return (
        icons[playerIndex] ||
        "⚪"
    );

}


/* =====================================================
   PLAYER COLOR
   ===================================================== */

function getPlayerColor(
    playerIndex
) {

    const colors = [

        "red",

        "green",

        "yellow",

        "blue"

    ];


    return (
        colors[playerIndex] ||
        "red"
    );

}


/* =====================================================
   TOKEN STATUS
   ===================================================== */

function getTokenStatus(
    position
) {

    if (
        position === -1
    ) {

        return "Home";

    }


    if (
        position >= 56
    ) {

        return "Finished";

    }


    return `Position ${position}`;

}


/* =====================================================
   FORMAT PLAYER
   ===================================================== */

function formatPlayerName(
    player
) {

    if (
        !player
    ) {

        return "Guest";

    }


    return (
        player.name ||
        "Guest"
    );

}